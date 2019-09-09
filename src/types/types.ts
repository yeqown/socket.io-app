export interface ISession {
    userId: number,
    socketId: string,
    clientIp: string,
    token: string,
    nsp: string,
    meta: object,
}

export class Session implements ISession {
    userId: number
    socketId: string
    clientIp: string
    token: string
    nsp: string
    meta: object

    constructor(req?: IAuthReq, nsp?: string, socketId?: string, clientIp?: string) {
        this.userId = req && req.userId || 0
        this.meta = req && req.meta || {}
        this.token = req && req.token || ""
        this.socketId = socketId || ""
        this.clientIp = clientIp || ""
        this.nsp = nsp || ""
    }

    private _toObject(): Object {
        return new Object({
            userId: this.userId,
            socketId: this.socketId,
            clientIp: this.clientIp,
            token: this.token,
            nsp: this.nsp,
            meta: this.meta,
        })
    }

    marshal(): string {
        return JSON.stringify(this._toObject())
    }

    unmarshal(d: string): ISession {
        // console.log("unmarshal session form: ", d);
        try {
            let { userId, socketId, clientIp, token, nsp, meta } = JSON.parse(d)
            this.userId = userId
            this.socketId = socketId
            this.clientIp = clientIp
            this.token = token
            this.nsp = nsp
            this.meta = meta
        } catch (err) {
            throw err
        }

        return this
    }
}

export interface IJoinRoomReq {
    roomId: string
}

export interface IJoinRoomsReq {
    rooms: IJoinRoomReq[]
}

export interface IOnoff {
    token: string // AuthReq 中的 Token
    meta: object // AuthReq 中的 Meta
    evtTyp: string // 事件类型: connect, disconnect(tcpclean)
    evtTimestamp: number // 事件时间戳
    socketId: string // 链接的唯一标志
    clientIp: string // 客户端IP
}

export interface IAuthReq {
    token: string,
    userId: number,
    meta: object,
}

export class AuthReq implements IAuthReq {
    token: string
    userId: number
    meta: object

    constructor(userId: Required<number>, token: Required<string>, meta: object) {
        this.token = token
        this.userId = userId
        this.meta = meta
    }
}

export interface IAuthReply {
    errmsg: string,
    errcode: number,
}

export class AuthReply implements IAuthReply {
    errcode: number
    errmsg: string

    constructor(errcode: Required<number>, errmsg: Required<string>) {
        this.errcode = errcode
        this.errmsg = errmsg
    }
}

export interface Err {
    errCode: number,
    errMsg: string,
}

