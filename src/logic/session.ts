import { RedisClient } from "redis"
import { IAuthReq, Session, IRedisClientAsync } from "../types"

interface SessionManager {
    set(socketId: string, authReq: IAuthReq): Error | null

    delBySocketId(socketId: string): Error | null
    delByUserId(userId: string, nsp: string): Error | null;

    queryByUserId(userId: number, nsp: string): Session | Error | null
    queryBySocketId(socketId: string): Session | Error | null
}

class SManagerBasedRedis implements SessionManager {
    redisAsync: IRedisClientAsync

    constructor(rc: IRedisClientAsync) {
        this.redisAsync = rc
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

export { SessionManager, SManagerBasedRedis }