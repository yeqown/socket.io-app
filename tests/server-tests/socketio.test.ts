import { describe, it, suiteTeardown } from 'mocha'
import assert from 'assert'
import io from 'socket.io-client'
// import io from 'socket.io'
import { proto } from '../../src/types'

let client: any

suiteTeardown(() => {
    client.close()
    console.log("socketioServers teardown")
})

describe("socketioServers", () => {
    let nspName = "demo"
    let addr = "http://localhost:3000" + "/" + nspName
    let path = "socket.io"

    it("client connect", () => {
        try {
            client = io(addr, { path: path })
            let msg: proto.IMessage = new proto.Message({ content: "msg" }, "chat/users")
            let uMsg: proto.IUsersMessage = new proto.UsersMessage(nspName, 2222, msg)
            client.emit("chat/users", uMsg)
        } catch (err) {
            // console.log(err);
            // err = err
            assert(err === null)
        }
    })
})