import { SocketioWrapper } from "./socketio"
import io from 'socket.io'

import { EventType, genOnoffMsg } from '../logic'
import { logger } from '../utils/ins'
import { proto, IJoinRoomsReq, IJoinRoomReq, AuthReq, IAuthReq, SocketioOptions, ISession, ApiResponse, codes, getMessage } from '../types'

export class SocketWrapper {
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

export enum builtinEvts {
    // 链接生命事件
    Connection = "connection",
    Disconnect = "disconnect",
    // 链接鉴权
    Auth = "auth",
    AuthReply = "auth/reply",
    // 房间操作
    Join = "join",
    Leave = "leave",
    // 聊天
    ChatWithUser = "chat/users",
    ChatInRoom = "chat/rooms",
    ChatBroadcast = "chat/broadcast",
    // 信号
    SingalToUser = "signal/user",
    SignalInRooms = "signal/room",
    SignalBoradcast = "signal/broadcast",
    // 错误
    LogicErr = "logic/error"
}

interface ISocketioErr {
    errcode: number
    errmsg: string
}

export const genSocketioErr = (errcode: number, errmsg?: string): ISocketioErr => {
    return {
        errcode: errcode,
        errmsg: errmsg || getMessage(errcode),
    }
}

export const getDisconnectEvtHdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): (() => void) => {
    return () => {
        logger.info("a socket disconnected, and it's socketId is: %s", socket.id)
        let _socket = _this._sockets.get(socket.id)
        if (_socket) {
            _socket.getSocket().leaveAll()
            _this._sockets.delete(socket.id) // remove from _sockets
            let onoff = genOnoffMsg(_socket.getToken(), _socket.getMeta(), EventType.Off, socket.id, socket.handshake.address)
            _this._onoffEmitter.off(_nsp.name, onoff) // call onoff emitter
            try {
                // call session manager
                _this._sm.delBySocketId(socket.id)
            } catch (error) {
                logger.error("could not delete session, ", error)
            }
        }
    }
}

export const getAuthEvtHdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((req: AuthReq) => void) => {
    return async (req: AuthReq) => {
        logger.info("auth socketId: ", socket.id, "args:", req)
        // call Auth Logic
        let reply = _this._auth.verify(req)
        socket.emit(builtinEvts.AuthReply, reply)

        if (reply.errcode == codes.OK) {
            // check user has logined ? if logined, then let the logined client offline
            try {
                let session = await _this._sm.queryByUserId(req.userId, _nsp.name)
                let _socket = _this._sockets.get(session.socketId)
                if (!_socket) {
                    logger.error(`could not get socket by socketId=${session.socketId}`)
                    return
                }
                _this._sockets.delete(session.socketId)
                _socket.getSocket().emit(builtinEvts.LogicErr, genSocketioErr(codes.ServerErr, "you've logined at another place"))
                _socket.getSocket().disconnect(true)
                await _this._sm.delBySocketId(_socket.getSocket().id)
                let onoff = genOnoffMsg(_socket.getToken(), _socket.getMeta(), EventType.Off, _socket.getSocket().id, _socket.getSocket().handshake.address)
                _this._onoffEmitter.off(_nsp.name, onoff)
            } catch (error) {
                logger.warn("could query session by userId: %d", req.userId, error)
            }

            try {
                // check userId online, if online, deactive another client
                _this._sockets.set(socket.id, new SocketWrapper(socket, req))
                let clientIp = socket.handshake.address
                let onoff = genOnoffMsg(req.token, req.meta, EventType.On, socket.id, clientIp)
                _this._onoffEmitter.on(_nsp.name, onoff)
                _this._sm.set(socket.id, _nsp.name, clientIp, req)
            } catch (error) {
                logger.error("could not set session, ", error)
            }
        } else {
            // auth failed
            socket.disconnect(true)
        }
    }
}

export const getJoinEvtHdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((req: IJoinRoomsReq) => void) => {
    return (req: IJoinRoomsReq) => {
        logger.info("recv join evt: ", socket.id, req)
        req.rooms.forEach((joinRoomReq: IJoinRoomReq) => {
            logger.info("socket join room", joinRoomReq.roomId)
            socket.join(joinRoomReq.roomId)
        })
    }
}

export const getChatusersEvthdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((uMsgs: proto.IUsersMessage[]) => void) => {
    return (uMsgs: proto.IUsersMessage[]) => {
        logger.info("chat/users recv msg: ", uMsgs)
        uMsgs.forEach((msg: proto.IUsersMessage) => {
            _this._sm.queryByUserId(msg.userId, msg.nspName)
                .then((v: ISession) => {
                    let _socket = _this._sockets.get(v.socketId)
                    if (_socket) {
                        _socket.getSocket().emit(msg.msg.evt, msg.msg)
                    }
                })
                .catch((err: Error) => {
                    logger.error(`could not get session by userId=${msg.userId}, err=${err}`)
                    return
                })
        })
    }
}

export const getChatroomsEvtHdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((rMsgs: proto.IRoomsMessage[]) => void) => {
    return (rMsgs: proto.IRoomsMessage[]) => {
        logger.info("recv broadcast_rooms msg", rMsgs)
        // TODO: limits socket sending msg while it's been knockoutted
        rMsgs.forEach((msg: proto.IRoomsMessage) => {
            _nsp.in(msg.roomId).emit(msg.msg.evt, msg.msg)
        })
    }
}