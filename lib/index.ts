import { IAuthReq, IAuthReply, IJoinRoomsReq, proto, AuthReq } from '../src/types'
import { ITokenr, DesTokenr } from '../src/logic'
// import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'

export interface IAuthCallback {
    (reply: IAuthReply): void
}

export interface CommonCallback {
    (...args: any): void
}

export interface IClient {
    auth(userId: number, meta: any, cb: IAuthCallback): void
    join(req: IJoinRoomsReq, cb: CommonCallback): void
}

export interface Options {
    path: string
}

export interface EvtCallback {
    evt: string
    cb: CommonCallback
}

export class Client implements IClient {
    _socket: SocketIOClient.Socket
    _des: ITokenr

    constructor(addr: string, opt: Options, cbs: EvtCallback[]) {
        this._des = new DesTokenr()
        // console.log(addr, opt, cbs);
        this._socket = io(addr, opt)
        this._socket.on("logic/error", (err: any) => {
            console.log("recv an error: ", err)
        })

        cbs.forEach((evtCb) => {
            this._socket.on(evtCb.evt, evtCb.cb)
        })
    }

    auth(userId: number, meta: any, cb: IAuthCallback): void {
        let req = this._des.gen(userId, meta)
        // let req: IAuthReq = new AuthReq(userId, tok, meta)
        this._socket.emit("auth", req)
        this._socket.once("auth/reply", cb)
    }

    join(req: IJoinRoomsReq, cb: CommonCallback): void {
        this._socket.emit("join", req)
        this._socket.once("join/reply", cb)
    }

    sendInRoom(roomId: string, meta: any): void {
        // let meta = { content: }
        let msg: proto.IMessage = new proto.Message(meta)
        msg.evt = 'chat/rooms'
        let roomsMsg: proto.IRoomsMessage = new proto.RoomsMessage(roomId, msg)
        try {
            this._socket.emit("chat/rooms", [roomsMsg])
        } catch (err) {
            throw err
        }
    }

    sendToUser(userId: number, meta: any): void {
        let msg: proto.IMessage = new proto.Message(meta)
        msg.evt = "chat/users"
        let usersMsg: proto.IUsersMessage = new proto.UsersMessage(userId, msg)

        try {
            this._socket.emit("chat/users", [usersMsg])
        } catch (err) {
            throw err
        }
    }
}