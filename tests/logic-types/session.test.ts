
import { SManagerBasedRedis, ISessionManager } from '../../src/logic/session'
import { RedisClient } from 'redis'
import { AuthReq, IAuthReq, Session } from '../../src/types'
import assert from 'assert'
import { describe, it, suiteSetup } from 'mocha'
import { configureLogger } from '../../src/utils/ins'
import path from 'path'

suiteSetup(() => {
    configureLogger(path.join(__dirname, "../../confs/log4js.json"))
})

describe("logic.session", () => {
    let opt = {
        host: "127.0.0.1",
        port: 6379,
        db: 0,
    }

    // client and manager
    let rc: RedisClient = new RedisClient(opt)
    let sm: ISessionManager = new SManagerBasedRedis(rc)

    // test param
    let socketId = "sock#id1111"
    let userId = 10000
    let nspName = "sock"
    let clientIp = "127.0.0.1"
    let token = "1203912hasioajeo10238y"
    let meta = { socketId, nspName, clientIp }
    let req: IAuthReq = {
        token,
        userId,
        meta,
    }

    it("session.set", async () => {
        try {
            let v = await sm.set(socketId, nspName, clientIp, req)
            assert(v !== null)
        } catch (error) {
            assert(error === null)
        }
    })

    it("session.query", () => {
        sm.queryByUserId(userId, nspName).then(s => {
            assert(s instanceof Session)
            if (s instanceof Session) {
                assert(s.nsp === nspName)
                assert(s.clientIp === clientIp)
                assert(s.token === token)
                assert(JSON.stringify(s.meta) === JSON.stringify(meta))
                return
            }
        }).catch(err => {
            console.log("queryByUserId, ", err);
            assert(err === null)
        })

        sm.queryByUserId(userId, nspName).then(s => {
            assert(s instanceof Session)
            if (s instanceof Session) {
                assert(s.nsp === nspName)
                assert(s.clientIp === clientIp)
                assert(s.token === token)
                assert(JSON.stringify(s.meta) === JSON.stringify(meta))
            }
        }).catch(err => {
            console.log("queryByUserId err, ", err);
            assert(err === null)
        })
    })

    it("session.delete", async () => {
        try {
            let result = await sm.delBySocketId(socketId)
            await sm.set(socketId, nspName, clientIp, req)
            result = await sm.delByUserId(userId, nspName)
            assert(result !== null)
        } catch (error) {
            assert(error === null)
        }
    })
})