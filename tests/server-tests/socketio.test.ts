import { describe, it } from 'mocha'
import assert from 'assert'
import io from 'socket.io-client'
import { proto } from '../../src/types'

describe("servers", () => {
    let addr = "http://localhost:3000/demo"
    let path = "socket.io"

    it("socketio.server to client", () => {
        let err: Error | null = null
        try {
            let client = io(addr, { path: path })
            let msg: proto.IMessage = new proto.Message({ content: "msg" }, "chat/users")
            let uMsg: proto.IUsersMessage = new proto.UsersMessage(2222, msg)
            client.emit("chat/users", uMsg)
        } catch (err) {
            console.log(err);
            err = err
        }
        assert(err === null)
    })
})