// import { proto } from "@/types"
// import express from 'express'
import io from 'socket.io'
import redisAdapter, { SocketIORedisOptions } from 'socket.io-redis'
import express from 'express'
import { Request, Response } from "express";
import http from 'http'
import { ClientOpts as RedisOpts } from 'redis'
// import { RedisClient } from 'redis'

import { proto, IJoinRoomsReq, AuthReq, IAuthReq, SocketioOptions, ISession, ApiResponse } from '../types'
import { codes, getMessage, addSlashLeft } from '../utils'
import { logger, mgoClient, redisClient } from '../utils/ins'
import {
    ISessionManager, IOnoffEmitter,
    SManagerBasedRedis, OnoffEmitterBasedRedis, OnoffMsg, EventType, ITokenr, DesTokenr,
    INspConfiger, INspConfig, NspConfigRepo, NspConfig,
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

    constructor(opt: SocketioOptions, redisOpts: RedisOpts) {
        logger.info("init SocketioWrapper with opts: ", opt, redisOpts);
        this.port = opt.port || 3000

        this._sm = new SManagerBasedRedis(redisClient)
        this._nspConfiger = new NspConfigRepo(mgoClient, opt.nspConfigOpt)
        this._onoffEmitter = new OnoffEmitterBasedRedis(redisClient)
        this._auth = new DesTokenr()

        this._nsps = new Map<string, io.Namespace>()
        this._sockets = new Map<string, SocketWrapper>()

        // create socketio server
        this._app = express()
        this._app.use(express.urlencoded())
        this._httpSrv = http.createServer(this._app)

        // generate socket.io server
        let redisAdapterOpts: SocketIORedisOptions = {
            host: redisOpts.host,
            port: redisOpts.port,
            auth_pass: redisOpts.password,
        }
        this._io = io(this._httpSrv, {
            path: opt.path,
            transports: opt.transport ? opt.transport : undefined,
        }).adapter(redisAdapter(redisAdapterOpts))

        this._mountHandlers()
        this._mountNsps()
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

    // /**
    //  * creata an Nsp and listen evt on it
    //  */
    // createNsp = (nspCfg: INspConfig): Error | null => {
    //     let _nsp = this._nsps.get(nspCfg.name)
    //     if (_nsp === undefined) {

    //         let err = new Error("duplicate nsp name")
    //         logger.error("could not create a Nsp with error:", err)
    //         return err
    //     }

    //     try {
    //         this._nspConfiger.applyFor(nspCfg)
    //     } catch (err) {
    //         logger.error("coule not apply for a Nsp with error: ", err)
    //         return err
    //     }

    //     return null
    // }

    // /**
    //  * rmeove an Nsp [Nsp event & Nsp]
    //  * @param nspName
    //  */
    // removeNsp = (nspName: string): Error | null => {
    //     nspName = addSlashLeft(nspName)
    //     let _nsp = this._nsps.get(nspName)
    //     if (_nsp === undefined) {
    //         let err = new Error("undefined nsp")
    //         return err
    //     }

    //     _nsp.removeAllListeners()
    //     this._nsps.delete(nspName)
    //     delete this._io.nsps[nspName]

    //     return null
    // }


    private _authed(socketId: string): boolean {
        return (this._sockets.get(socketId) !== undefined)
    }

    /**
     * _mountNsps loads all nsp configs from configer then
     * register nsp into socket.io also handlers to evts includes built-in and custom
     */
    private _mountNsps = async () => {
        try {
            let cfgs = await this._nspConfiger.allNsp()
            cfgs.forEach((cfg: INspConfig) => {
                let nspName = addSlashLeft(cfg.name)
                if (this._nsps.get(nspName)) {
                    logger.error("duplicate nsp name config: ", nspName)
                    return
                }
                // register handlers
                logger.info("generate nsp name: ", nspName, "evts:", cfg.listenEvts)
                let _nsp = this._io.of(nspName)

                // TODO: using middleware

                // handle connection to socket
                _nsp.on("connection", (socket: io.Socket) => {
                    logger.info("a new socket incomming, and it's socketId is: %s, nspName: %s",
                        socket.id, socket.nsp.name)
                    this._hdlSocketConn(_nsp, socket, cfg)
                })

                // record nsp
                this._nsps.set(nspName, _nsp)
            })
        } catch (error) {
            logger.error(error)
        }
    }

    /**
     * hdl socket with it's evt
     * @param _nsp
     * @param socket
     * handle more event: 
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
            socket.disconnect(true)
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
                try {
                    this._sm.delBySocketId(socket.id)
                } catch (error) {
                    logger.error("could not delete session, ", error)
                }
            }
        })

        socket.on("auth", async (req: AuthReq) => {
            logger.info("auth socketId: ", socket.id, "args:", req)
            // call Auth Logic
            let reply = this._auth.verify(req)
            socket.emit("auth/reply", reply)

            if (reply.errcode == codes.OK) {
                // true: auth success
                // save socketid to socket and request meta
                this._sockets.set(socket.id, new SocketWrapper(socket, req))
                // call onoff emitter
                let clientIp = socket.handshake.address
                let onoff = new OnoffMsg(req.token, req.meta, EventType.On, socket.id, clientIp)
                this._onoffEmitter.on(_nsp.name, onoff)
                // call session manager
                try {
                    await this._sm.set(socket.id, _nsp.name, clientIp, req)
                } catch (error) {
                    logger.error("could not set session, ", error)
                }
            } else {
                // auth failed
                socket.disconnect(true)
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
                this._sm.queryByUserId(msg.userId, msg.nspName)
                    .then((v: ISession) => {
                        let _socket = this._sockets.get(v.socketId)
                        if (_socket) {
                            _socket.getSocket().emit(msg.msg.evt, msg.msg)
                        }
                    })
                    .catch((err: Error) => {
                        logger.error(`could not get session by userId=${msg.userId}, err=${err}`)
                        return
                    })
            })
        })

        socket.on("chat/rooms", (rMsgs: proto.IRoomsMessage[]) => {
            logger.info("recv broadcast_rooms msg", rMsgs)
            // TODO: limits socket sending msg while it's been knockoutted
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
     * _mountHandlers, register handler to `app` typeof `express`
     */
    private _mountHandlers = () => {
        this._app.get("/api/nsps/all", this.hdlGetAllNsps)
        this._app.get("/api/nsps/:nspName", this.hdlGetNsp)
        this._app.post("/api/nsps/gen", this.hdlGenNsp)
        this._app.delete("/api/nsps/:nspName", this.hdlRemoveNsp)
    }

    /**
     * broadcast
     * broadcast to all rooms in current nsp
     */
    broadcast = (nspName: string, msg: proto.IMessage): void => {
        nspName = addSlashLeft(nspName)
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }
        _nsp.emit(msg.evt, msg)
    }

    /**
     * broadcastRooms 
     * broadcast msg to rooms
     */
    broadcastRooms = (nspName: string, msgs: proto.IRoomsMessage[]): void => {
        nspName = addSlashLeft(nspName)
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error(__filename, 332, "could not get nsp by name: ", nspName)
            return
        }

        msgs.forEach((rMsg: proto.IRoomsMessage) => {
            _nsp.in(rMsg.roomId).emit(rMsg.msg.evt, rMsg.msg)
        })
    }

    /**
     * broadcastUsers
     * send msg to spec users
     */
    broadcastUsers = (nspName: string, msgs: proto.IUsersMessage[]) => {
        nspName = addSlashLeft(nspName)
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error(__filename, 349, "could not get nsp by name: ", nspName)
            return
        }
        msgs.forEach((uMsg: proto.IUsersMessage) => {
            _nsp.in(uMsg.userId.toString()).emit(uMsg.msg.evt, uMsg.msg)
        });
    }


    /**
     * deactiveByUserId disconnect
     * disconnect with client by userId
     */
    deactiveByUserId = async (nspName: string, userId: number) => {
        nspName = addSlashLeft(nspName)
        let _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error(__filename, 365, "could not find nsp by nspName=", nspName)
            return
        }

        try {
            let session = await this._sm.queryByUserId(userId, nspName)
            let _socket = this._sockets.get(session.socketId)
            if (!_socket) {
                logger.error(`could not get socket by socketId=${session.socketId}`)
                return
            }
            _socket.getSocket().disconnect(true)
        } catch (error) {
            logger.error(`could not find session by userId=${userId}, err=${error}`)
        }
    }


    /**
     * knockoutFromRoom
     * force client for be disconnected
     */
    knockoutFromRoom = async (nspName: string, roomId: string, userId: number) => {
        nspName = addSlashLeft(nspName)
        let _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error("could not find nsp by nspName=", nspName)
        }

        try {
            let session = await this._sm.queryByUserId(userId, nspName)
            let _socket = this._sockets.get(session.socketId)
            if (!_socket) {
                logger.error(`could not get socket by socketId=${session.socketId}`);
                return
            }
            _socket.getSocket().leave(roomId)
            logger.info(`knockout userId=${userId} from room=${roomId}`)
        } catch (error) {
            logger.error(`could not find session by userId=${userId}, err=${error}`)
        }
    }

    /**
     * clearRooms
     * remove all clients' socket from room
     */
    clearRooms = (nspName: string, roomIds: string[]) => {
        nspName = addSlashLeft(nspName)
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) { logger.error(`could not find nsp by nspName=${nspName}`); return }

        roomIds.forEach((roomId: string) => {
            logger.info("clear room with roomId=", roomId)
            _nsp.in(roomId).clients((err: Error, socketIds: string[]) => {
                if (err) { logger.error("loop client get error: ", err, socketIds); return }
                socketIds.forEach((socketId: string) => {
                    let _socket = this._sockets.get(socketId)
                    if (!_socket) { logger.error("could not get socket by socketId=", socketId); return }
                    _socket.getSocket().emit("logic/error", new Error(`you are removed from room=${roomId}`))
                    _socket.getSocket().leave(roomId, (err: Error) => {
                        if (err) { logger.error(`socketId=${socketId} could not leave roomId=${roomId} with err=${err}`); return }
                        logger.info(`socketId=${socketId} has leaved room roomId=${roomId}`)
                    })
                })
            })
        })
    }

    /**
     * TODO: add mroe nsp info
     */
    hdlGetAllNsps = async (req: Request, resp: Response) => {
        let r = new ApiResponse()
        try {
            let cfgs = await this._nspConfiger.allNsp()
            if (cfgs && cfgs.length) {
                r.setErrcode(codes.OK)
                r.setData(cfgs)
                resp.json(r) && resp.end()
            }
        } catch (error) {
            r.setErrcode(codes.ServerErr, error.message)
            resp.json() && resp.end()
            return
        }
    }

    /**
     * 
     * TODO: add nsp monitor data
     */
    hdlGetNsp = async (req: Request, resp: Response) => {
        let r = new ApiResponse()
        let { nspName } = req.params

        try {
            let cfgs = await this._nspConfiger.allNsp()
            let nsps = cfgs.filter((cfg: INspConfig) => {
                return nspName === cfg.name
            })

            r.setErrcode(codes.OK)
            r.setData(nsps)
            resp.json(r) && resp.end()
        } catch (error) {
            r.setErrcode(codes.ServerErr)
            resp.json() && resp.end()
            return
        }
    }

    /**
     * hdlGenNsp generate an Nsp with config
     * TODO: multi node to sync the nsp config, for now, you have to restart server manually
     */
    hdlGenNsp = async (req: Request, resp: Response) => {
        logger.info(req.body)
        let r = new ApiResponse()
        let { nspName = '', evts } = req.body
        if (nspName === '') {
            r.setErrcode(codes.ParamInvalid, "nspName could not be empty")
            resp.json(r) && resp.end()
            return
        }

        if (typeof evts !== 'string' && !Array.isArray(evts)) {
            r.setErrcode(codes.ParamInvalid, "evts type incorrect")
            resp.json(r) && resp.end()
            return
        }

        if (typeof evts === 'string') {
            evts = [evts]
        }

        let cfg = new NspConfig(nspName, evts)
        try {
            await this._nspConfiger.applyFor(cfg)
            r.setErrcode(codes.OK)
            resp.json(r) && resp.end()
            return
        } catch (error) {
            r.setErrcode(codes.ServerErr, error.message)
            resp.json(r) && resp.end()
            return
        }
    }

    /**
     * hdlRemoveNsp
     * remove nsp config from nspConfiger
     * TODO: multi node to sync nsp config
     */
    hdlRemoveNsp = (req: Request, resp: Response) => {
        let { nspName } = req.params
        resp.json("nspName")
        resp.end()
        return
    }
}

export { SocketioWrapper }