import io from 'socket.io-client'

// import { IAuthReply, IJoinRoomsReq } from '../src/types/types'
import * as proto from './proto'
import { ITokenr, DesTokenr } from './des'
// import { addSlashLeft } from '../src/utils/lib'


interface IJoinRoomReq {
    roomId: string
}

interface IJoinRoomsReq {
    rooms: IJoinRoomReq[]
}

interface IAuthReply {
    errmsg: string,
    errcode: number,
}

const addSlashLeft = (s: string): string => {
    if (s[0] !== "/") return "/" + s
    return s
}

interface IAuthCallback {
    (reply: IAuthReply): void
}

interface CommonCallback {
    (...args: any): void
}

interface IClient {
    auth(userId: Required<number>, meta: any, cb: IAuthCallback): void
    join(req: IJoinRoomsReq, cb: CommonCallback): void
}

interface Options {
    host: Required<string>
    nspName: Required<string>
    path: string
}

interface EvtCallback {
    evt: string
    cb: CommonCallback
}

export class Client implements IClient {
    _socket: SocketIOClient.Socket
    _des: ITokenr
    _opt: Options

    constructor(opt: Options, cbs: EvtCallback[]) {
        this._opt = opt
        this._des = new DesTokenr()
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
        let msg: proto.IMessage = proto.genMessage('chat/rooms')
        msg.meta = JSON.stringify(meta)
        let roomsMsg: proto.IRoomsMessage = proto.genRoomsMessage(this._opt.nspName, roomId, msg)
        try {
            this._socket.emit("chat/rooms", [roomsMsg])
        } catch (err) {
            throw err
        }
    }

    sendToUser(userId: number, meta: any): void {
        let msg: proto.IMessage = proto.genMessage('chat/users')
        msg.meta = JSON.stringify(meta)
        let usersMsg: proto.IUsersMessage = proto.genUsersMessage(this._opt.nspName, userId, msg)

        try {
            this._socket.emit("chat/users", [usersMsg])
        } catch (err) {
            throw err
        }
    }
}