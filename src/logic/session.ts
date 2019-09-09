import { RedisClient } from "redis"
import { IAuthReq, Session, ISession, Err } from "../types"
import { logger } from "../utils/ins"
import { rmSlashLeft } from '../utils'
import { promisify } from 'util'

interface ISessionManager {
    set(socketId: string, nspName: string, clientIp: string, req: IAuthReq): Error | null

    delBySocketId(socketId: string): Error | null
    delByUserId(userId: number, nspName: string): Error | null;

    queryByUserId(userId: number, nspName: string): Promise<ISession | Error>
    queryBySocketId(socketId: string): Promise<ISession | Error>
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
    set(socketId: string, nspName: string, clientIp: string, req: IAuthReq): Error | null {
        logger.info("set session: ", socketId, nspName, clientIp)

        let session = new Session(req, nspName, socketId, clientIp)
        let v = session.marshal()
        let multi = this.rc.multi()

        multi.set(SManagerBasedRedis._genSocketIdKey(socketId), v)
        multi.set(SManagerBasedRedis._genUserIdKey(req.userId, nspName), v)
        multi.exec_atomic((err: Error | null, reply: any) => {
            if (err) { logger.error(__filename, "could not set session"); return err }
            if (reply) logger.info(__filename, `set session=${session} with reply: ${reply}`)
        })

        return null
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
    public delBySocketId(socketId: string): Error | null {
        this.queryBySocketId(socketId).then((v: ISession | Error) => {
            if (v instanceof Error) {
                // true err
                logger.error("could not get session by socketId: ", socketId)
                return v
            }
            let multi = this.rc.multi()
            multi.del(SManagerBasedRedis._genSocketIdKey(socketId))
            multi.del(SManagerBasedRedis._genUserIdKey(v.userId, v.nsp))
            multi.exec_atomic((err: Error | null, reply: any) => {
                if (err) { logger.error(`could not del session by socketId=${socketId}`); return err }
                if (reply) logger.info(`del session by socketId=${socketId} with reply: ${reply}`)
            })
            return null
        })

        return null
    }

    /**
     * 
     * @param userId 
     * @param nspName 
     */
    public delByUserId(userId: number, nspName: string): Error | null {
        this.queryByUserId(userId, nspName)
            .then((v: ISession | Error) => {
                if (v instanceof Error) {
                    // true err
                    logger.error("could not get session by userId: ", userId)
                    return
                }

                let multi = this.rc.multi()
                multi.del(SManagerBasedRedis._genSocketIdKey(v.socketId))
                multi.del(SManagerBasedRedis._genUserIdKey(userId, nspName))
                multi.exec_atomic((err, reply) => {
                    if (err) { logger.error(`could not del session by userId=${userId} nsp=${nspName}`); return err }
                    if (reply) logger.info(`del session by userId=${userId} nsp=${nspName} with reply: ${reply}`)
                })
            })

        return null
        // return v
    }

    queryByUserId(userId: number, nspName: string): Promise<ISession | Error> {
        let key = SManagerBasedRedis._genUserIdKey(userId, nspName)
        let getAsync = promisify(this.rc.get).bind(this.rc)

        let v = getAsync(key).then((v: string) => {
            if (!v) {
                return new Error("empty session string")
            }
            return new Session().unmarshal(v)
        }).catch((err: Error) => {
            console.log(err)
            logger.error(`could not queryByUserId with key=${key}: `, err)
            return err
        })

        return v
        // unreachable code
    }

    async queryBySocketId(socketId: string): Promise<ISession | Error> {
        let key = SManagerBasedRedis._genSocketIdKey(socketId)
        let getAsync = promisify(this.rc.get).bind(this.rc)

        let v = getAsync(key).then((v: string) => {
            if (!v) {
                return new Error("empty session string")
            }
            return new Session().unmarshal(v)
        }).catch((err: Error) => {
            console.log(err)
            logger.error("could not queryBySocketId: ", err)
            return err
        })

        return v
        // unreachable code
    }
}

export { ISessionManager, SManagerBasedRedis }