import { ApiResponse, codes } from '../types'
import { Request, Response, Handler } from "express";
import { SocketioWrapper } from './app';
import { NspConfig, INspConfig, IRoom } from '../logic'
import { logger } from '../utils/ins'


export const getHdlGetAllNsps = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let r = new ApiResponse()
        try {
            let cfgs = await _this._nspConfiger.allNsp()
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
}

export const getHdlGetNsp = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let r = new ApiResponse()
        let { nspName } = req.params

        try {
            let cfgs = await _this._nspConfiger.allNsp()
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
}


export const getHdlGenNsp = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
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
            await _this._nspConfiger.applyFor(cfg)
            r.setErrcode(codes.OK)
            resp.json(r) && resp.end()
            return
        } catch (error) {
            r.setErrcode(codes.ServerErr, error.message)
            resp.json(r) && resp.end()
            return
        }
    }
}

// TODO:
export const getHdlRemoveNsp = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let { nspName } = req.params
        resp.json("nspName")
        resp.end()
        return
    }
}


export const getHdlStatics = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let r = new ApiResponse()
        // Object.keys(this._io.nsps).forEach(nspName => {
        // this._io.nsps[nspName].sockets[socketId].
        // })

        let roomStats: Object[] = []
        _this._rooms.forEach((v: IRoom, roomId: string) => {
            roomStats.push({ roomId: v.statics() })
        })

        r.setData({
            socketCnt: _this._sockets.size,
            nspCount: _this._nsps.size,
            roomsCount: _this._rooms.size,
            roomStat: roomStats,
        })
        resp.json(r) && resp.end()
    }
}


export const getHdlStaticsRoom = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let { roomId } = req.query
        let r = new ApiResponse()

        if (roomId) {
            logger.debug("socketID", roomId)
            let room = _this._rooms.get(roomId)
            r.setErrcode(codes.OK)
            if (room) {
                r.setData({
                    stat: room.statics(),
                    userIds: room.userIdsArr(),
                })
            }
        } else {
            r.setErrcode(codes.OK)
            r.setData({ sockets: Array.from(_this._sockets.keys()) })
        }

        resp.json(r) && resp.end()
        return
    }
}


export const getHdlStaticsSockets = (_this: SocketioWrapper) => async (req: Request, resp: Response) => {
    return async (req: Request, resp: Response) => {
        let { socketId } = req.query
        let r = new ApiResponse()

        if (socketId) {
            logger.debug("socketID", socketId)
            let sw = _this._sockets.get(socketId)
            r.setErrcode(codes.OK)
            if (sw) {
                r.setData({
                    meta: sw.getMeta(),
                    userId: sw.getUserId(),
                    socketStat: {
                        id: sw.getSocket().id,
                        connected: sw.getSocket().connected,
                        disconnected: sw.getSocket().disconnect,
                    }
                })
            }
        } else {
            r.setErrcode(codes.OK)
            r.setData({ sockets: Array.from(_this._sockets.keys()) })
        }

        resp.json(r) && resp.end()
        return
    }
}
