// import { proto } from "@/types"
// import express from 'express'
import io from 'socket.io'
import redisAdapter, { SocketIORedisOptions } from 'socket.io-redis'
import express from 'express'

import http from 'http'
import { ClientOpts as RedisOpts, RedisClient, createClient } from 'redis'

import { proto, SocketioOptions, ISession } from '../types'
import { codes, getMessage, addSlashLeft } from '../utils'
import { logger, mgoClient, redisClient } from '../utils/ins'
import { ISessionManager, IOnoffEmitter, SManagerBasedRedis, OnoffEmitterBasedRedis, ITokenr, DesTokenr, INspConfiger, INspConfig, NspConfigRepo, NspConfig, IRoom } from '../logic'
import { builtinEvts, getDisconnectEvtHdl, SocketWrapper, getAuthEvtHdl, getJoinEvtHdl, getChatusersEvthdl, getChatroomsEvtHdl, genSocketioErr } from './app_socket_helper';
import { IRpcCommand, rpcCommandEvt, gRPCService, disconnectMeta } from './grpc'
import { getHdlGetAllNsps, getHdlGetNsp, getHdlGenNsp, getHdlRemoveNsp, getHdlStatics, getHdlStaticsRoom, getHdlStaticsSockets } from './app_http_helper'

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
    _pub: RedisClient

    _io: io.Server
    _httpSrv: http.Server
    _app: express.Application

    _nsps: Map<string, io.Namespace>

    // only save authed socket, not authed or auth-failed socket will be disconnect, 
    // and not trigger online or offline evt
    _sockets: Map<string, SocketWrapper>
    _rooms: Map<string, IRoom>

    constructor(opt: SocketioOptions, redisOpts: RedisOpts) {
        logger.info("init SocketioWrapper with opts: ", opt, redisOpts);
        this.port = opt.port || 3000

        this._sm = new SManagerBasedRedis(redisClient)
        this._nspConfiger = new NspConfigRepo(mgoClient, opt.nspConfigOpt)
        this._onoffEmitter = new OnoffEmitterBasedRedis(redisClient)
        this._auth = new DesTokenr()
        this._pub = createClient(redisOpts)

        this._nsps = new Map<string, io.Namespace>()
        this._sockets = new Map<string, SocketWrapper>()
        this._rooms = new Map<string, IRoom>()

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

    disconnectBroadcast(session: ISession): void {
        logger.info("disconnectGlobal called")
        let meta: disconnectMeta = { nspName: session.nsp, userId: session.userId, socketId: session.socketId }
        let command: IRpcCommand = {
            evt: rpcCommandEvt.disconnect,
            meta: meta,
        }
        this._pub.publish(gRPCService.pubsubTopic(), JSON.stringify(command))
    }


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

                // using middleware to refuse invalid nspName
                _nsp.use((socket: io.Socket, next: (err?: any) => void) => {
                    let nspName = addSlashLeft(socket.nsp.name)
                    if (this._nsps.has(nspName)) {
                        next()
                        return
                    }
                    // if nsp not allowed, then refuse this client
                    next(new Error("nsp not allowed"))
                })

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
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }

        logger.debug("SocketioWrapper.broadcastRooms, ", msgs)
        msgs.forEach((rMsg: proto.IRoomsMessage) => {
            let room = this._rooms.get(rMsg.roomId)
            if (!room) {
                logger.warn("SocketioWrapper.broadcastRooms failed to get room by roomId=%s", rMsg.roomId)
                return
            }
            room.broadcast(rMsg.msg.evt, rMsg.msg)
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
     * deactiveUser disconnect
     * disconnect with client by userId or socketId
     */
    deactiveUser = async (nspName: string, userId: number, socketId: string) => {
        nspName = addSlashLeft(nspName)
        let _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error("could not find nsp by nspName=", nspName)
            return
        }

        if (socketId) {
            // true: socketId is higher proority than userId
            let _socket = this._sockets.get(socketId)
            if (_socket) {
                _socket.getSocket().disconnect(true)
                return
            }
            return
        }

        // try to deactive user by userId 
        try {
            let session = await this._sm.queryByUserId(userId, nspName)
            let _socket = this._sockets.get(session.socketId)
            if (_socket) {
                _socket.getSocket().disconnect(true)
            }
            return
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
     * FIXME: clear clients in toom
     */
    clearRooms = (nspName: string, roomIds: string[]) => {
        nspName = addSlashLeft(nspName)
        const _nsp = this._nsps.get(nspName)
        if (!_nsp) {
            logger.error(`could not find nsp by nspName=${nspName}`)
            return
        }

        roomIds.forEach((roomId: string) => {
            logger.info("clear room with roomId=", roomId)
            _nsp.in(roomId).clients((err: Error, socketIds: string[]) => {
                if (err) {
                    logger.error("loop client get error: ", err, socketIds)
                    return
                }

                // sockets leave room
                socketIds.forEach((socketId: string) => {
                    let _socket = this._sockets.get(socketId)
                    if (!_socket) {
                        logger.error("could not get socket by socketId=", socketId)
                        return
                    }
                    _socket.getSocket().emit("logic/error", new Error(`you are removed from room=${roomId}`))
                    _socket.getSocket().leave(roomId, (err: Error) => {
                        if (err) {
                            logger.error(`socketId=${socketId} could not leave roomId=${roomId} with err=${err}`)
                            return
                        }
                    })
                    // FIXME: also leave from this._rooms [custom room]
                })
            })
        })
    }

    /**
    * _mountHandlers, register handler to `app` typeof `express`
    */
    private _mountHandlers = () => {
        this._app.post("/api/nsps/gen", getHdlGenNsp(this))
        this._app.get("/api/nsps/all", getHdlGetAllNsps(this))
        this._app.get("/api/nsps/:nspName", getHdlGetNsp(this))
        this._app.delete("/api/nsps/:nspName", getHdlRemoveNsp(this))
        // statics
        this._app.get("/api/statics", getHdlStatics(this))
        this._app.get("/api/statics/rooms", getHdlStaticsRoom(this))
        this._app.get("/api/statics/sockets", getHdlStaticsSockets(this))
    }
}

export { SocketioWrapper }