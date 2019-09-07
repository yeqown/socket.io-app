import { ITokenr, DesTokenr } from '../../src/logic'

import { describe, it } from 'mocha'
import assert from 'assert'
import { IAuthReq, IAuthReply } from '../../src/types'
import { codes, getMessage } from '../../src/utils'

describe('logic.auth', () => {
    let tokenr: ITokenr = new DesTokenr()
    let req: IAuthReq
    let meta = { name: 'for', age: 100 }

    it("gen token", () => {
        req = tokenr.gen(1000, meta)
        assert(req.userId === 1000)
        assert(req.token !== "")
        assert(JSON.stringify(meta) === JSON.stringify(req.meta))
    })

    it("verify req", () => {
        let reply: IAuthReply = tokenr.verify(req)
        assert(reply.errcode === codes.OK)
        assert(reply.errmsg === getMessage(codes.OK))
    })
})