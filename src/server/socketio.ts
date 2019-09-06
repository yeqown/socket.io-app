// import { proto } from "@/types"
// import express from 'express'
import io from 'socket.io'
import express from 'express'
import { Request, Response } from "express";
import http from 'http'
import { proto, IRedisClientAsync } from 'src/types'
import { ISessionManager, SManagerBasedRedis } from '../logic'
import { logger } from '../utils/logger'
import { IRoomsMessage, IUsersMessage, IMessage } from 'src/types/proto'

interface Options {
    port: Required<number>,
    path: Required<string>,
    transport?: string[],
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

    _io: io.Server
    _httpSrv: http.Server
    _app: express.Application

    _nsps: Map<string, io.Namespace>
    _sockets: Map<string, io.Socket>

    constructor(opt: Options, rc: IRedisClientAsync) {
        logger.info("socketio-wrapper initializing with opts: ", opt);
        this.port = opt.port || 3000
        this._sm = new SManagerBasedRedis(rc)
        this._nspConfiger = new NspConfiger()
        this._nsps = new Map<string, io.Namespace>()
        this._sockets = new Map<string, io.Socket>()

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
            logger.error(err)
            return err
        }

        try {
            this._nspConfiger.applyFor(nspCfg)
        } catch (err) {
            logger.error(err)
            return err
        }

        return null
    }

    /**
     * rmeove an Nsp [Nsp event & Nsp]
     * TODO:
     */
    removeNsp = (nspName: string): Error | null => {
        let _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            let err = new Error("undefined nsp")
            return err
        }

        _nsp.removeAllListeners()
        return null
    }

    private _mountNsps = () => {
        let nspCfgs = this._nspConfiger.allNsp()

        nspCfgs.forEach(cfg => {
            if (this._nsps.get(cfg.name)) {
                logger.error("duplicate nsp name config: ", cfg.name)
                return
            }

            // register handlers
            logger.info("generate nsp name: ", cfg.name, "evts:", cfg.listenEvts)
            let _nsp = this._io.of(cfg.name)

            _nsp.on("connection", (socket: io.Socket) => {
                logger.info("connected socketId: ", socket.id)
                this._sockets.set(socket.id, socket)

                socket.on("disconnect", (d) => {
                    logger.info("disconnect socketId: ", socket.id, "args:", d)
                    this._sockets.delete(socket.id)
                })

                socket.on("auth", (d) => {
                    logger.info("auth socketId: ", socket.id, "args:", d)
                })

                socket.on("chat/users", (uMsg: IUsersMessage) => {
                    logger.info("chat/users recv msg: ", uMsg)
                    let _sockid = uMsg.userId.toString()
                    let _socket = this._sockets.get(_sockid)
                    if (_socket) _socket.emit(uMsg.msg.evt, uMsg.msg)
                })

                socket.on("chat/broadcast_rooms", (rMsg: IRoomsMessage) => {
                    _nsp.in(rMsg.roomId).emit(rMsg.msg.evt, rMsg.msg)
                })

                // listening custom evt and mount
                cfg.listenEvts.forEach(evt => {
                    socket.on(evt, (data: any) => {
                        // TODO: not authed client should not be allowed to send any msg
                        logger.info("evt: ", evt, "data: ", data)
                    })
                })
            })

            // record nsp
            this._nsps.set(cfg.name, _nsp)
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

        msgs.forEach((rMsg: IRoomsMessage) => {
            _nsp.in(rMsg.roomId).emit(rMsg.msg.evt, rMsg.msg)
        })
    }

    broadcastUsers = (nspName: string, msgs: proto.IUsersMessage[]) => {
        const _nsp = this._nsps.get(nspName)
        if (_nsp === undefined) {
            logger.error("could not get nsp by name: ", nspName)
            return
        }
        msgs.forEach((uMsg: IUsersMessage) => {
            _nsp.in(uMsg.userId.toString()).emit(uMsg.msg.evt, uMsg.msg)
        });
    }

    hdlGetAllNsps = (req: Request, resp: Response) => {
        let r = JSON.stringify(this._nspConfiger.allNsp())
        resp.write(r)
        resp.end()
    }

    hdlGetNsp = (req: Request, resp: Response) => {
        let { nspName } = req.params
        // logger.info(req.path)
        let nsps = this._nspConfiger.allNsp().filter((cfg: NpsConfig) => {
            return nspName === cfg.name
        })
        resp.write(JSON.stringify(nsps))
        resp.end()
    }
}

interface INspConfig {
    name: string
    listenEvts: string[]
    // TODO: add more
}

class NpsConfig implements INspConfig {
    name: Required<string>
    listenEvts: Required<string[]>

    constructor(name: Required<string>, evts: Required<string[]>) {
        this.name = name
        this.listenEvts = evts
    }
}
interface INspConfiger {
    allNsp(): INspConfig[]
    applyFor(cfg: INspConfig): void
    remove(nsp: string): void
}

/**
 * Nsp Configer for socket.io server to  manage nsp configs
 * TODO: based mongodb or redis
 */
class NspConfiger implements INspConfiger {
    constructor() { }

    // TODO:
    allNsp(): INspConfig[] {
        let nspCfgs = new Array<NpsConfig>()
        nspCfgs.push(new NpsConfig("demo", ["chat", "ban", "join"]))
        return nspCfgs
    }

    // TODO: apply new nsp, and nsp name should be only one
    applyFor(cfg: INspConfig) {

    }

    remove(nsp: string) {

    }

    _valid(nsp: string): boolean {
        // TODO: valid nsp name, characters and existence
        return true
    }
}

export { SocketioWrapper, Options }