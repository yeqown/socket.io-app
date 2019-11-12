// import { proto } from "@/types"
// import express from 'express'
import io from 'socket.io'
import redisAdapter, { SocketIORedisOptions } from 'socket.io-redis'
import express from 'express'
import { Request, Response } from "express";
import http from 'http'
import { ClientOpts as RedisOpts } from 'redis'

import { proto, SocketioOptions, ApiResponse } from '../types'
import { codes, getMessage, addSlashLeft } from '../utils'
import { logger, mgoClient, redisClient } from '../utils/ins'
import { ISessionManager, IOnoffEmitter, SManagerBasedRedis, OnoffEmitterBasedRedis, ITokenr, DesTokenr, INspConfiger, INspConfig, NspConfigRepo, NspConfig, } from '../logic'
import { builtinEvts, getDisconnectEvtHdl, SocketWrapper, getAuthEvtHdl, getJoinEvtHdl, getChatusersEvthdl, getChatroomsEvtHdl, genSocketioErr } from './socketio_helper';

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


    public authed(socketId: string): boolean {
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
                _nsp.on(builtinEvts.Connection, (socket: io.Socket) => {
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
            if (this.authed(socket.id)) {
                // has authed, break
                return
            }
            // send an timeout error to client
            logger.error("connection refused: auth timeout")
            socket.emit(builtinEvts.LogicErr, genSocketioErr(codes.AuthTimeout))
            socket.disconnect(true)
        }, 5000)

        // hdl disconnect evt
        socket.on(builtinEvts.Disconnect, getDisconnectEvtHdl(this, _nsp, socket))
        socket.on(builtinEvts.Auth, getAuthEvtHdl(this, _nsp, socket))
        socket.on(builtinEvts.Join, getJoinEvtHdl(this, _nsp, socket))
        socket.on(builtinEvts.ChatWithUser, getChatusersEvthdl(this, _nsp, socket))
        socket.on(builtinEvts.ChatInRoom, getChatroomsEvtHdl(this, _nsp, socket))

        // listening custom evt and mount
        cfg.listenEvts.forEach(evt => {
            socket.on(evt, (...args: any[]) => {
                if (!this.authed(socket.id)) {
                    // true: not authed client should not be allowed to send any msg
                    logger.error("connection refused: not authed")
                    socket.emit(builtinEvts.LogicErr, genSocketioErr(codes.NotAuthed))
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
        logger.info("nsp broadcast, ", msg.evt, msg)
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
            logger.error("could not get nsp by name: ", nspName)
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
            logger.error("could not get nsp by name: ", nspName)
            return
        }

        msgs.forEach(async (uMsg: proto.IUsersMessage) => {
            try {
                let session = await this._sm.queryByUserId(uMsg.userId, nspName)
                let _socket = this._sockets.get(session.socketId)
                if (!_socket) {
                    logger.warn("could not find socket with userId: ", uMsg.userId)
                    return
                }
                _socket.getSocket().emit(uMsg.msg.evt, uMsg.msg)
            } catch (error) {
                logger.error("could not send evt to user", nspName, uMsg.userId)
            }
            // _nsp.in(uMsg.userId.toString()).emit(uMsg.msg.evt, uMsg.msg)
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
            this._sockets.delete(session.socketId)
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