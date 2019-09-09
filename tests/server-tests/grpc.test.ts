import { describe, suiteTeardown, suiteSetup, it, xit } from 'mocha'
import grpc_pb from '../../src/codegen/api/api_grpc_pb'
import api_pb from '../../src/codegen/api/api_pb'
import grpc from 'grpc'
import assert from "assert"


let client: grpc_pb.SocketMServiceClient

suiteSetup(() => {

})

suiteTeardown(() => {
    // console.log(client);
    client.close()
    console.log("all done")
    // TOFIX: unittest could not finished
    process.exit()
})

describe("grpcServers", () => {
    client = new grpc_pb.SocketMServiceClient("127.0.0.1:3001", grpc.credentials.createInsecure())

    it('nsp broadcast testing', () => {
        let req = new api_pb.NspBroadcastReq()
        let msg = new api_pb.Message()

        msg.setVer("1.0.0")
        msg.setId("29381023jj")
        msg.setEvt("chat/user")
        msg.setMeta(JSON.stringify({ foo: "bar", code: 1 }))

        req.setMsg(msg)
        req.setNspname("demo")

        client.nspBroadcast(req, (err: grpc.ServiceError | null, resp: api_pb.NspBroadcastResp) => {
            // console.log("req: ", req);
            // console.log("err: ", err);
            // console.log("resp: ", resp.getErrcode(), resp.getErrmsg());
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })

    it('nsp rooms broadcast testing', () => {
        let req = new api_pb.NspRoomsBroadcastReq()
        let msg = new api_pb.Message()
        let roomMsg = new api_pb.RoomMessage()

        msg.setVer("1.0.0")
        msg.setId("29381023jj")
        msg.setEvt("chat/user")
        msg.setMeta(JSON.stringify({ foo: "bar", code: 1 }))

        roomMsg.setRoomid("roomId=111")
        roomMsg.setMsg(msg)

        req.setNspname("demo")
        req.setMsgsList([roomMsg])

        client.nspRoomsBroadcast(req, (err: grpc.ServiceError | null, resp: api_pb.NspRoomsBroadcastResp) => {
            // console.log("req: ", req);
            // console.log("err: ", err);
            // console.log("resp: ", resp.getErrcode(), resp.getErrmsg());
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })

    it('nsp users broadcast testing', () => {
        let req = new api_pb.NspUsersBroadcastReq()
        let userMsg = new api_pb.UserMessage()
        let msg = new api_pb.Message()

        msg.setVer("1.0.0")
        msg.setId("29381023jj")
        msg.setEvt("chat/user")
        msg.setMeta(JSON.stringify({ foo: "bar", code: 1 }))

        userMsg.setUserid(1000)
        userMsg.setMsg(msg)

        req.setNspname("demo")
        req.setMsgsList([userMsg])

        client.nspUsersBroadcast(req, (err: grpc.ServiceError | null, resp: api_pb.NspUsersBroadcastResp) => {
            // console.log("req: ", req);
            // console.log("err: ", err);
            // console.log(err)
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })


    it('knockout 100 from 1001', () => {
        let req = new api_pb.KnockoutReq()
        req.setNspname("demo")
        let metas: api_pb.KnockoutMeta[] = [100].map<api_pb.KnockoutMeta>((v: number): api_pb.KnockoutMeta => {
            let meta = new api_pb.KnockoutMeta()
            meta.setUserid(v)
            meta.setRoomid('1001')
            return meta
        })
        req.setMetasList(metas)
        client.knockoutFromRoom(req, (err: grpc.ServiceError | null, resp: api_pb.KnockoutResp) => {
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })

    it('clear rooms: [1001, 1002]', () => {
        let req = new api_pb.ClearRoomsReq()
        req.setNspname("demo")
        req.setRoomidsList(['1001', '1002'])
        client.clearRooms(req, (err: grpc.ServiceError | null, resp: api_pb.ClearRoomsResp) => {
            console.log(err);
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })

    it('disconnect 100', () => {
        let req = new api_pb.DisconnectReq()
        req.setNspname("demo")
        req.setUserid(100)
        client.disconnect(req, (err: grpc.ServiceError | null, resp: api_pb.DisconnectResp) => {
            assert(err === null)
            assert(resp.getErrcode() === 0)
        })
    })
})