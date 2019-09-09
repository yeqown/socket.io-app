// import { proto } from "@/types"
// import express from 'express'
import io from 'socket.io'
import express from 'express'
import { Request, Response } from "express";
import http from 'http'
import { RedisClient } from 'redis'

import { proto, IJoinRoomsReq, AuthReq, IAuthReq, SocketioOptions } from '../types'
import { codes, getMessage } from '../utils'
import { logger } from '../utils/ins'
import {
    ISessionManager, IOnoffEmitter,
    SManagerBasedRedis, OnoffEmitterBasedRedis, OnoffMsg, EventType, ITokenr, DesTokenr,
    INspConfiger, INspConfig, NspConfigRepo,
} from '../logic'


const _logicErrorEvt = "logic/error"


class SocketWrapper {
    private _socket: io.Socket
    private _authreq: IAuthReq

    constructor(socket: io.Socket, req: IAuthReq) {
        this._socket = socket
        this._authreq = req
    }

    getSocket(): io.Socket {
        return this._socket
    }

    getUserId(): number {
        return this._authreq.userId
    }

    getMeta(): any {
        return this._authreq.meta
    }

    getToken(): string {
        return this._authreq.token
    }
}

/**
 * SocketioWrapper provides some simpe methods and calls logic
 * meta to control the process
 * 1. control nsp and and it's config
 * 2. listen on evt for nsp, and call logic
 * 3. manage session
 */
class SocketioWrapper {
    /*
        to manage callers' nsp and serving on port
    */
    port: number

    _sm: ISessionManager
    _nspConfiger: INspConfiger
    _onoffEmitter: IOnoffEmitter
    _auth: ITokenr

    _io: io.Server
    _httpSrv: http.Server
    _app: express.Application

    _nsps: Map<string, io.Namespace>

    // only save authed socket, not authed or auth-failed socket will be disconnect, 
    // and not trigger online or offline evt
    _sockets: Map<string, SocketWrapper>

    constructor(opt: SocketioOptions, rc: RedisClient) {
        logger.info("socketio-wrapper initializing with opts: ", opt);
        this.port = opt.port || 3000

        this._sm = new SManagerBasedRedis(rc)
        this._nspConfiger = new NspConfigRepo(rc)
        this._onoffEmitter = new OnoffEmitterBasedRedis(rc)
        this._auth = new DesTokenr()

        this._nsps = new Map<string, io.Namespace>()
        this._sockets = new Map<string, SocketWrapper>()

        // create socketio server
        this._app = express()
        this._httpSrv = http.createServer(this._app)
        this._io = io(this._httpSrv, {
            path: opt.path,
            transports: opt.transport ? opt.transport : undefined,
        })

        this._mountHandlers()
        this._mountNsps()
    }

    /**
     * creata an Nsp and listen evt on it
     */
    createNsp = (nspCfg: INspConfig): Error | null => {
        let _nsp = this._nsps.get(nspCfg.name)
        if (_nsp === undefined) {
            let err = new Error("duplicate nsp name")
            logger.error("could not create a Nsp with error:", err)
            return err
        }

        try {
            this._nspConfiger.applyFor(nspCfg)
        } catch (err) {
            logger.error("coule not apply for a Nsp with error: ", err)
            return err
        }

        return null
    }

    /**
     * rmeove an Nsp [Nsp event & Nsp]
     * @param nspName
     */
    removeNsp = (nspName: string): Error | null => {
        let _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            let err = new Error("undefined nsp")
            return err
        }

        _nsp.removeAllListeners()
        this._nsps.delete(nspName)
        delete this._io.nsps[nspName]

        return null
    }

    private _mountNsps = () => {
        let nspCfgs = this._nspConfiger.allNsp()
        nspCfgs.forEach((cfg: INspConfig) => {
            if (this._nsps.get(cfg.name)) {
                logger.error("duplicate nsp name config: ", cfg.name)
                return
            }

            // register handlers
            logger.info("generate nsp name: ", cfg.name, "evts:", cfg.listenEvts)
            let _nsp = this._io.of(cfg.name)

            // TODO: using middleware
            // _nsp.use((socket: io.Socket, next: (err?: any) => void): void => {
            //     next()
            // })

            _nsp.on("connection", (socket: io.Socket) => {
                logger.info("a new socket incomming, and it's socketId is: %s, nspName: %s",
                    socket.id, socket.nsp.name)
                this._hdlSocketConn(_nsp, socket, cfg)
            })

            // record nsp
            this._nsps.set(cfg.name, _nsp)
        })

        // TODO:
        // refused all connection to root Nsp
        // this._io.of(new RegExp("^\/$")).on("connection", (socket: io.Socket) => {
        //     if (socket.connected) {
        //         logger.error("connection refused: could not use root nsp, nspName is: ", socket.nsp.name)
        //         socket.emit(_logicErrorEvt, new Error("connection refused"))
        //     }
        //     socket.disconnect()
        // })
    }

    private _authed(socketId: string): boolean {
        return (this._sockets.get(socketId) !== undefined)
    }

    /**
     * hdl socket with it's evt
     * @param _nsp
     * @param socket
     * TODO: handle more event: 
     * refer to: https://socket.io/docs/client-api/#Event-%E2%80%98connect-error%E2%80%99
     */
    private _hdlSocketConn = (_nsp: io.Namespace, socket: io.Socket, cfg: INspConfig) => {
        // auth req timeout
        setTimeout(() => {
            if (this._authed(socket.id)) {
                // has authed, break
                return
            }
            // send an timeout error to client
            logger.error("connection refused: auth timeout")
            socket.emit(_logicErrorEvt, new Error(getMessage(codes.AuthTimeout)))
            socket.disconnect()
        }, 5000)

        // hdl disconnect evt
        socket.on("disconnect", () => {
            logger.info("a socket disconnected, and it's socketId is: ", socket.id, "args: ", null)

            let _socket = this._sockets.get(socket.id)
            if (_socket) {
                // if has authed
                socket.leaveAll()
                // remove from _sockets
                this._sockets.delete(socket.id)
                // call onoff emitter
                let onoff = new OnoffMsg(_socket.getToken(), _socket.getMeta(), EventType.Off, socket.id, socket.handshake.address)
                this._onoffEmitter.on(_nsp.name, onoff)
                // call session manager
                if (this._sm.delBySocketId(socket.id)) logger.error("could not delete session")
            }
        })

        socket.on("auth", (req: AuthReq) => {
            logger.info("auth socketId: ", socket.id, "args:", req)
            // call Auth Logic
            let reply = this._auth.verify(req)
            socket.emit("auth/reply", reply)

            if (reply.errcode == codes.OK) {
                // true: auth success
                // save socketid to socket and req meta
                this._sockets.set(socket.id, new SocketWrapper(socket, req))
                // call onoff emitter
                let clientIp = socket.handshake.address
                let onoff = new OnoffMsg(req.token, req.meta, EventType.On, socket.id, clientIp)
                this._onoffEmitter.on(_nsp.name, onoff)
                // call session manager
                if (this._sm.set(socket.id, _nsp.name, clientIp, req)) logger.error("could not set session")
            } else {
                // auth failed
                socket.disconnect()
            }
        })

        socket.on("join", (req: IJoinRoomsReq) => {
            logger.info("recv join evt: ", socket.id, req)
            req.rooms.forEach(joinRoomReq => {
                logger.info("socket join room", joinRoomReq.roomId)
                socket.join(joinRoomReq.roomId)
            })
        })

        socket.on("chat/users", (uMsgs: proto.IUsersMessage[]) => {
            logger.info("chat/users recv msg: ", uMsgs)
            uMsgs.forEach((msg: proto.IUsersMessage) => {
                let _sockid = msg.userId.toString()
                let _socket = this._sockets.get(_sockid)
                if (_socket) _socket.getSocket().emit(msg.msg.evt, msg.msg)
            })
        })

        socket.on("chat/rooms", (rMsgs: proto.IRoomsMessage[]) => {
            logger.info("recv broadcast_rooms msg", rMsgs)

            rMsgs.forEach((msg: proto.IRoomsMessage) => {
                _nsp.in(msg.roomId).emit(msg.msg.evt, msg.msg)
            })
        })

        // listening custom evt and mount
        cfg.listenEvts.forEach(evt => {
            socket.on(evt, (...args: any[]) => {
                if (!this._authed(socket.id)) {
                    // true: not authed client should not be allowed to send any msg
                    logger.error("connection refused: not authed")
                    socket.emit(_logicErrorEvt, new Error("not authed"))
                    return
                }

                // TODO: how to deal wtih these message, ignored ?
                logger.info("evt: ", evt, "data: ", args)
            })
        })
    }

    /**
    * open socket.io server 
    * 1. createNsp from configs , if no configs just skip this step
    * 2. serving nsps
    */
    serve = () => {
        this._httpSrv.listen(this.port, () => {
            logger.info("running on: ", this.port)
        })
    }

    private _mountHandlers = () => {
        this._app.get("/api/nsps/all", this.hdlGetAllNsps)
        this._app.get("/api/nsps/:nspName", this.hdlGetNsp)
    }

    broadcast = (nspName: string, msg: proto.IMessage): void => {
        const _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }
        _nsp.emit(msg.evt, msg)
    }

    broadcastRooms = (nspName: string, msgs: proto.IRoomsMessage[]): void => {
        const _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }

        msgs.forEach((rMsg: proto.IRoomsMessage) => {
            _nsp.in(rMsg.roomId).emit(rMsg.msg.evt, rMsg.msg)
        })
    }

    broadcastUsers = (nspName: string, msgs: proto.IUsersMessage[]) => {
        const _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }
        msgs.forEach((uMsg: proto.IUsersMessage) => {
            _nsp.in(uMsg.userId.toString()).emit(uMsg.msg.evt, uMsg.msg)
        });
    }

    /**
     * TODO: add mroe nsp info
     */
    hdlGetAllNsps = (req: Request, resp: Response) => {
        let r = JSON.stringify(this._nspConfiger.allNsp())
        resp.write(r)
        resp.end()
    }

    /**
     * 
     * TODO: add nsp monitor data
     */
    hdlGetNsp = (req: Request, resp: Response) => {
        let { nspName } = req.params
        // logger.info(req.path)
        let nsps = this._nspConfiger.allNsp().filter((cfg: INspConfig) => {
            return nspName === cfg.name
        })
        resp.write(JSON.stringify(nsps))
        resp.end()
    }
}

export { SocketioWrapper }