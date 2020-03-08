import { SocketioWrapper } from "./app"
import io from 'socket.io'

import { EventType, genOnoffMsg, IRoom, RoomWithAck } from '../logic'
import { logger } from '../utils/ins'
import { proto, IJoinRoomsReq, AuthReq, IAuthReq, ISession, codes, getMessage } from '../types'

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
            // true: only the client will have socket which auths passed
            let onoff = genOnoffMsg(_socket.getToken(), _socket.getMeta(), EventType.Off, socket.id, socket.handshake.address)
            _this._onoffEmitter.off(_nsp.name, onoff)

            try {
                // call session manager
                _this._sm.delBySocketId(socket.id)
            } catch (error) {
                logger.error("could not delete session, ", error)
            }

            // release memory
            _socket.getSocket().leaveAll()              // leave room, not necessary
            _socket.getSocket().removeAllListeners()    // remove event listener
            _this._sockets.delete(socket.id)            // release map
            let userId = _socket.getUserId()            // release user from custom room
            _this._rooms.forEach((room: IRoom, roomId: string) => {
                room.leave(userId)
                if (room.isEmpty()) {
                    logger.info("roomwithack been released, socketId=%s", socket.id)
                    _this._rooms.delete(roomId)
                }
            })
        }
    }
}

export const getAuthEvtHdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((req: AuthReq) => void) => {
    return async (req: AuthReq) => {
        logger.info("auth socketId: ", socket.id, "args:", req)
        // call Auth Logic
        let reply = _this._auth.verify(req)
        // ISSUE: join but not authed
        // socket.emit(builtinEvts.AuthReply, reply)

        if (reply.errcode == codes.OK) {
            // check user has logined ? if logined, then let the logined client offline
            try {
                // if miss session, this will throw an Error
                let oldSession = await _this._sm.queryByUserId(req.userId, _nsp.name)
                // to clear oldSession
                await _this._sm.delByUserId(req.userId, _nsp.name)

                let _socket = _this._sockets.get(oldSession.socketId)
                if (_socket) {
                    // true: oldSession and socket were found
                    _this._sockets.delete(oldSession.socketId)
                    _socket.getSocket().emit(builtinEvts.LogicErr, genSocketioErr(codes.ServerErr, "you've logined at another place"))
                    _socket.getSocket().disconnect(true)
                    // let onoff = genOnoffMsg(oldSession.token, oldSession.meta, EventType.Off, oldSession.socketId, oldSession.clientIp)
                    // _this._onoffEmitter.off(_nsp.name, onoff)
                } else {
                    // true: get oldSession but there's no socket kept
                    // maybe, server crashed or reboot
                    logger.warn(`could not get socket by socketId=${oldSession.socketId}`)
                    _this.disconnectBroadcast(oldSession)
                }
            } catch (error) {
                logger.warn("could query session by userId: %d", req.userId, error)
            }

            try {
                // check userId online, if online, deactive another client
                _this._sockets.set(socket.id, new SocketWrapper(socket, req))
                let clientIp = socket.handshake.address
                // To make sure the off message is faster than online message
                // Remember to upper the 1500 to an proper value, so that your distribute-system can work well
                setTimeout(() => {
                    let onoff = genOnoffMsg(req.token, req.meta, EventType.On, socket.id, clientIp)
                    _this._onoffEmitter.on(_nsp.name, onoff)
                }, 1500)

                if (socket.connected) {
                    // true: socket still connected
                    _this._sm.set(socket.id, _nsp.name, clientIp, req)
                }

                socket.emit(builtinEvts.AuthReply, reply)
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
        if (!_this.authed(socket.id)) {
            // true: if not authed, throw an error
            socket.emit(builtinEvts.LogicErr, genSocketioErr(codes.NotAuthed))
            return
        }

        req.rooms.forEach(joinRoomReq => {
            logger.info("getJoinEvtHdl socket join room", joinRoomReq.roomId)
            // socket.join(joinRoomReq.roomId)
            let room = _this._rooms.get(joinRoomReq.roomId)
            if (!room) {
                room = new RoomWithAck(joinRoomReq.roomId)
                _this._rooms.set(joinRoomReq.roomId, room)
            }

            let sw = _this._sockets.get(socket.id)
            if (room && sw) {
                room.join(sw.getUserId(), socket)
            }
            // _this._rooms
        })
    }
}

export const getChatusersEvthdl = (_this: SocketioWrapper, _nsp: io.Namespace, socket: io.Socket): ((uMsgs: proto.IUsersMessage[]) => void) => {
    return (uMsgs: proto.IUsersMessage[]) => {
        logger.info("chat/users recv msg: ", uMsgs)
        if (!_this.authed(socket.id)) {
            // true: if not authed, throw an error
            socket.emit(builtinEvts.LogicErr, genSocketioErr(codes.NotAuthed))
            return
        }
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
        // FIXME: limits socket sending msg while it's been knockoutted
        if (!_this.authed(socket.id)) {
            // true: if not authed, throw an error
            socket.emit(builtinEvts.LogicErr, genSocketioErr(codes.NotAuthed))
            return
        }
        rMsgs.forEach((msg: proto.IRoomsMessage) => {
            _nsp.in(msg.roomId).emit(msg.msg.evt, msg.msg)
        })
    }
}