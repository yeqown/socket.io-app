import { IAuthReply, IJoinRoomsReq } from '../src/types/types'
import * as proto from '../src/types/proto'
import { ITokenr, DesTokenr } from '../src/logic/auth'
// import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'
import { addSlashLeft } from '../src/utils'

export interface IAuthCallback {
    (reply: IAuthReply): void
}

export interface CommonCallback {
    (...args: any): void
}

export interface IClient {
    auth(userId: Required<number>, meta: any, cb: IAuthCallback): void
    join(req: IJoinRoomsReq, cb: CommonCallback): void
}

export interface Options {
    host: Required<string>
    nspName: Required<string>
    path: string
}

export interface EvtCallback {
    evt: string
    cb: CommonCallback
}

export class Client implements IClient {
    _socket: SocketIOClient.Socket
    _des: ITokenr
    _opt: Options

    constructor(opt: Options, cbs: EvtCallback[]) {
        this._des = new DesTokenr()
        this._opt = opt
        // console.log(addr, opt, cbs);
        let addr = opt.host + addSlashLeft(opt.nspName)
        this._socket = io(addr, opt)
        this._socket.on("logic/error", (...args: any[]) => {
            console.log("recv an error: ", args)
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
        let roomsMsg: proto.IRoomsMessage = new proto.RoomsMessage(this._opt.nspName, roomId, msg)
        try {
            this._socket.emit("chat/rooms", [roomsMsg])
        } catch (err) {
            throw err
        }
    }

    sendToUser(userId: number, meta: any): void {
        let msg: proto.IMessage = new proto.Message(meta)
        msg.evt = "chat/users"
        let usersMsg: proto.IUsersMessage = new proto.UsersMessage(this._opt.nspName, userId, msg)

        try {
            this._socket.emit("chat/users", [usersMsg])
        } catch (err) {
            throw err
        }
    }
}