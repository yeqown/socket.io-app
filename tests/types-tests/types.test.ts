import { AuthReq, IAuthReq, AuthReply, IAuthReply, proto } from "../../src/types"
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

    it("AuthReply", () => {
        let ar: IAuthReply = new AuthReply(0, "ok");
        assert(ar.errcode === 0)
        assert(ar.errmsg = "ok")
    })

    it("Message", () => {
        let meta = { this: "foo", item: "bar" }
        let msg: proto.IMessage = new proto.Message(meta)
        assert(msg.id !== '')
        assert(msg.ver !== '')
        assert(msg.evt === 'message')
        assert(JSON.stringify(meta) === JSON.stringify(msg.meta))
    })

    it("UsersMessage", () => {
        let meta = { this: "foo", item: "bar" }
        let userId = 123
        let msg: proto.IMessage = new proto.Message(meta)
        let rMsg: proto.IUsersMessage = new proto.UsersMessage("demo", userId, msg)

        assert(rMsg.msg === msg)
        assert(rMsg.userId === userId)
    })

    it("RoomsMessage", () => {
        let meta = { this: "foo", item: "bar" }
        let roomId = "123456"
        let msg: proto.IMessage = new proto.Message(meta)
        let rMsg: proto.IRoomsMessage = new proto.RoomsMessage("demo", roomId, msg)

        assert(rMsg.msg === msg)
        assert(rMsg.roomId === roomId)
    })
})