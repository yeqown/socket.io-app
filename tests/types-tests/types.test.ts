import { AuthReq, IAuthReq, AuthReply, IAuthReply } from "../../src/types"
import { describe, it } from 'mocha'
import assert from 'assert'

describe("types", () => {
    it("AuthReq", () => {
        let meta = { classId: 10, wxClassId: 10 }
        let req: IAuthReq = new AuthReq(100, "thisistoken", meta)
        // console.log(req);
        assert(req.userId === 100)
        assert(req.token === "thisistoken")
        assert(JSON.stringify(req.meta) === JSON.stringify(meta))
    })
})


describe("types", function () {
    it("AuthReply", function () {
        let ar: IAuthReply = new AuthReply(0, "ok");
        assert(ar.errcode === 0)
        assert(ar.errmsg = "ok")
    })
})
