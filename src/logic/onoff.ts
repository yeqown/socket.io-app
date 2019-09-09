import { IOnoff } from '../types'
import { getNowTimestamp } from '../utils'
import { logger } from '../utils/ins'
import { RedisClient } from 'redis'


enum EventType {
    On = "connect",
    Off = "disconnect",
}

interface EvtFunc {
    (data: IOnoff): Error | null
}

interface IOnoffEmitter {
    /**
     * 
     * @param nspName 
     * @param data 
     */
    on(nspName: string, data: IOnoff): void

    /**
     * 
     * @param nspName 
     * @param data 
     */
    off(nspName: string, data: IOnoff): void
}


class OnoffMsg implements IOnoff {
    token: string // AuthReq 中的 Token
    meta: any // AuthReq 中的 Meta
    evtTyp: string // 事件类型: connect, disconnect(tcpclean)
    evtTimestamp: number // 事件时间戳
    socketId: string // 链接的唯一标志
    clientIp: string // 客户端IP

    constructor(token: string, meta: any, evtTyp: EventType, socketId: string, clientIp: string) {
        this.token = token
        this.meta = meta
        this.evtTyp = evtTyp
        this.evtTimestamp = getNowTimestamp()
        this.socketId = socketId
        this.clientIp = clientIp
    }

    /**
     * validate
     * validate the onoff message wtih standard rules
     * TODO:
     */
    validate = (): Error | null => {
        return null
    }
}

class OnoffEmitterBasedMQ implements IOnoffEmitter {
    _mqConn: any

    constructor() {
        this._mqConn = null
    }

    off(nspName: string, data: IOnoff) {
        // TODO:
        throw new Error("Method not implemented.")
    }

    on(nspName: string, data: IOnoff) {
        // TODO:
        throw new Error("Method not implemented.")
    }
}

class OnoffEmitterBasedRedis implements IOnoffEmitter {
    rc: RedisClient

    constructor(rc: RedisClient) {
        this.rc = rc
    }

    /**
     * off means offline
     * @param nspName 
     * @param data 
     */
    off(nspName: string, data: IOnoff): void {
        let ch = OnoffEmitterBasedRedis._genTopic(nspName)
        // data.evtTyp = EventType.Off
        this.rc.publish(ch, JSON.stringify(data), (err: Error | null, reply: number) => {
            if (err) {
                logger.error("could not publish to %s with err: %v", ch, err)
                return
            } else {
                logger.info("publish to %s get result code: %d", ch, reply)
            }
        })
    }

    /**
     * on means online
     * @param nspName 
     * @param data 
     */
    on(nspName: string, data: IOnoff): void {
        let ch = OnoffEmitterBasedRedis._genTopic(nspName)

        // data.evtTyp = EventType.On
        this.rc.publish(ch, JSON.stringify(data), (err: Error | null, reply: number) => {
            if (err) {
                logger.error("could not publish to %s with err: %v", ch, err)
                return
            } else {
                logger.info("publish to %s get result code: %d", ch, reply)
            }
        })

    }

    /**
     * 
     * @param nspName 
     */
    static _genTopic(nspName: string): string {
        if (nspName === '') {
            throw new Error("nspName could not be empty")
        }

        return nspName + "/onoff"
    }
}

export {
    IOnoffEmitter,
    OnoffMsg, OnoffEmitterBasedMQ, OnoffEmitterBasedRedis,
    EventType
}