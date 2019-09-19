const grpc_pb = require('../../src/codegen/api/api_grpc_pb')
const api_pb = require('../../src/codegen/api/api_pb')
const grpc = require('grpc')

let { GRPC_HOST } = process.env
if (!GRPC_HOST) {
    throw Error("empty GRPC_HOST in env list")
}

const client = new grpc_pb.SocketMServiceClient(GRPC_HOST, grpc.credentials.createInsecure())
let req = new api_pb.NspBroadcastReq()
let msg = new api_pb.Message()

msg.setVer("1.0.0")
msg.setId("29381023jj")
msg.setEvt("chat/rooms")
msg.setMeta(JSON.stringify({ username: "sys", content: "notice: you're on chatting", roomId: "0" }))
req.setMsg(msg)
req.setNspname("demo")


client.nspBroadcast(req, (err, resp) => {
    console.log('nsp broadcast', req)
    console.log("result (err, resp): ", err, resp)
})