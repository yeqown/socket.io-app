import * as proto from './proto'

interface Session {
    userId: number,
    socketId: string,
    clientIp: string,
    token: string,
    nsp: string,
    meta: object,
}

interface Onoff {
    token: string // AuthReq 中的 Token
    meta: object // AuthReq 中的 Meta
    evtTyp: string // 事件类型: connect, disconnect(tcpclean)
    evtTimestamp: number // 事件时间戳
    socketId: string // 链接的唯一标志
    clientIp: string // 客户端IP
}

interface AuthReq {
    token: string,
    userId: number,
    meta: object,
}

interface AuthReply {

}

export { Session, Onoff, AuthReq, AuthReply, proto }