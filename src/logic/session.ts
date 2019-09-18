import { RedisClient } from "redis"
import { IAuthReq, Session, ISession } from "../types"
import { logger } from "../utils/ins"
import { rmSlashLeft } from '../utils'
import { promisify } from 'util'

interface ISessionManager {
    set(socketId: string, nspName: string, clientIp: string, req: IAuthReq): Promise<any>

    delBySocketId(socketId: string): Promise<any>
    delByUserId(userId: number, nspName: string): Promise<any>

    queryByUserId(userId: number, nspName: string): Promise<ISession>
    queryBySocketId(socketId: string): Promise<ISession>
}

class SManagerBasedRedis implements ISessionManager {
    /**
     * SManagerBasedRedis to manage session, manager support:
     * 1. socketId:     ISession
     * 2. nspName#userId:    ISession
     */
    rc: RedisClient
    getAsync: any

    constructor(rc: RedisClient) {
        this.rc = rc
        this.getAsync = promisify(this.rc.get)
    }

    /**
     * set
     * @param socketId 
     * @param nspName 
     * @param clientIp 
     * @param req 
     */
    set(socketId: string, nspName: string, clientIp: string, req: IAuthReq): Promise<any> {
        logger.info("set session: ", socketId, nspName, clientIp)
        let session = new Session(req, nspName, socketId, clientIp)

        const result = new Promise<any>((resolve, reject) => {
            let v = session.marshal()

            let multi = this.rc.multi()
            multi.set(SManagerBasedRedis._genSocketIdKey(socketId), v)
            multi.set(SManagerBasedRedis._genUserIdKey(req.userId, nspName), v)
            multi.exec_atomic((err: Error | null, reply: any) => {
                if (err) {
                    logger.error("could not set session:", err)
                    reject(err)
                }

                if (reply) {
                    logger.info(`set session=${session} with reply: ${reply}`)
                    resolve(reply)
                }
            })

        })

        return result
    }

    /**
     * _genSocketIdKey like "/demo#B6gWNy1-pcT9C2vZAAAA"
     * @param socketId 
     */
    static _genSocketIdKey(socketId: string): string {
        return socketId
    }

    /**
     * _genUserIdKey like "/demo#100"
     * @param userId 
     * @param nspName 
     */
    static _genUserIdKey(userId: number, nspName: string): string {
        return nspName + "#" + userId.toString()
    }

    /**
     * 
     * @param socketId 
     */
    public async delBySocketId(socketId: string): Promise<any> {
        let v = await this.queryBySocketId(socketId)
        const result = new Promise((resolve, reject) => {
            let multi = this.rc.multi()
            multi.del(SManagerBasedRedis._genSocketIdKey(socketId))
            multi.del(SManagerBasedRedis._genUserIdKey(v.userId, v.nsp))
            multi.exec_atomic((err: Error | null, reply: any) => {
                if (err) {
                    logger.error(`could not del session by socketId=${socketId}`)
                    reject(err)
                }
                if (reply) {
                    logger.info(`del session by socketId=${socketId} with reply: ${reply}`)
                    resolve(reply)
                }
            })
        })

        return result
    }

    /**
     * 
     * @param userId 
     * @param nspName 
     */
    public async delByUserId(userId: number, nspName: string): Promise<any> {
        let v = await this.queryByUserId(userId, nspName)

        // .then((v: ISession | Error) => {
        //     if (v instanceof Error) {
        //         // true err
        //         logger.error("could not get session by userId: ", userId)
        //         return
        //     }

        //     let multi = this.rc.multi()
        //     multi.del(SManagerBasedRedis._genSocketIdKey(v.socketId))
        //     multi.del(SManagerBasedRedis._genUserIdKey(userId, nspName))
        //     multi.exec_atomic((err, reply) => {
        //         if (err) { logger.error(`could not del session by userId=${userId} nsp=${nspName}`); return err }
        //         if (reply) logger.info(`del session by userId=${userId} nsp=${nspName} with reply: ${reply}`)
        //     })
        // })
        const result = new Promise((resolve, reject) => {
            let multi = this.rc.multi()
            multi.del(SManagerBasedRedis._genSocketIdKey(v.socketId))
            multi.del(SManagerBasedRedis._genUserIdKey(userId, nspName))
            multi.exec_atomic((err: Error | null, reply: any) => {
                if (err) {
                    logger.error(`could not del session by userId=${userId} nsp=${nspName}`)
                    reject(err)
                }
                if (reply) {
                    logger.info(`del session by userId=${userId} nsp=${nspName} with reply: ${reply}`)
                    resolve(reply)
                }
            })
        })
        return result
    }

    async queryByUserId(userId: number, nspName: string): Promise<ISession> {
        let key = SManagerBasedRedis._genUserIdKey(userId, nspName)
        let getAsync = promisify(this.rc.get).bind(this.rc)

        let v = await getAsync(key)
        if (!v) {
            throw Error("empty session string")
        }
        return new Session().unmarshal(v)
        // let v = await getAsync(key).then((v: string) => {
        //     if (!v) {
        //         return new Error("empty session string")
        //     }
        //     return new Session().unmarshal(v)
        // }).catch((err: Error) => {
        //     console.log(err)
        //     logger.error(`could not queryByUserId with key=${key}: `, err)
        //     return err
        // })

        // return v
        // unreachable code
    }

    async queryBySocketId(socketId: string): Promise<ISession> {
        let key = SManagerBasedRedis._genSocketIdKey(socketId)
        let getAsync = promisify(this.rc.get).bind(this.rc)

        let v = await getAsync(key)
        if (!v) {
            throw Error("empty session string")
        }

        return new Session().unmarshal(v)
        // unreachable code
    }
}

export { ISessionManager, SManagerBasedRedis }