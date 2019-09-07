import { RedisClient } from "redis"
import { IAuthReq, Session } from "../types"

interface ISessionManager {
    set(socketId: string, authReq: IAuthReq): Error | null

    delBySocketId(socketId: string): Error | null
    delByUserId(userId: string, nsp: string): Error | null;

    queryByUserId(userId: number, nsp: string): Session | Error | null
    queryBySocketId(socketId: string): Session | Error | null
}

class SManagerBasedRedis implements ISessionManager {
    rc: RedisClient

    constructor(rc: RedisClient) {
        this.rc = rc
    }

    set(socketId: string, authReq: IAuthReq): Error | null {
        return null
    }

    public delBySocketId(socketId: string): Error | null {
        return null
    }

    public delByUserId(userId: string, nsp: string): Error | null {
        return null
    }

    queryByUserId(userId: number, nsp: string): Session | Error | null {
        return null
    }

    queryBySocketId(socketId: string): Session | Error | null {
        return null
    }
}

export { ISessionManager, SManagerBasedRedis }