const grpc_pb = require('../../src/codegen/api/api_grpc_pb')
const api_pb = require('../../src/codegen/api/api_pb')
const grpc = require('grpc')

let { GRPC_HOST } = process.env
if (!GRPC_HOST) {
    throw Error("empty GRPC_HOST in env list")
}

const client = new grpc_pb.SocketMServiceClient(GRPC_HOST, grpc.credentials.createInsecure())
let req = new api_pb.KnockoutReq()
req.setNspname("demo")

let metas = [100].map((v) => {
    let meta = new api_pb.KnockoutMeta()
    meta.setUserid(v)
    meta.setRoomid('1001')
    return meta
})
req.setMetasList(metas)


client.knockoutFromRoom(req, (err, resp) => {
    console.log('knockout 100 from 1001 with req:', req)
    console.log("result (err, resp): ", err, resp)
})