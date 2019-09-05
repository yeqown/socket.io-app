const describe = require('mocha').describe
const grpc_pb = require('../../dist/codegen/api/api_grpc_pb')
const api_pb = require('../../dist/codegen/api/api_pb')
const grpc = require('grpc')
const assert = require("assert")

describe("grpc-server", function () {
    let addr = "127.0.0.1:3001"
    let client = new grpc_pb.SocketMServiceClient(addr, grpc.credentials.createInsecure())

    it('nsp broadcast testing', function () {
        let req = new api_pb.NspBroadcastReq()
        let msg = new api_pb.Message()

        msg.setVer("1.0.0")
        msg.setId("29381023jj")
        msg.setEvt("chat/user")
        msg.setMeta("this is content")
        req.setMsg(msg)

        client.nspBroadcast(req, function (err, resp) {
            // console.log("req: ", req);
            // console.log("err: ", err);
            // console.log("resp: ", resp.getErrcode(), resp.getErrmsg());
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })
})