import grpc, { GrpcObject } from "grpc"
import grpc_pb from '../codegen/api/api_grpc_pb'
import api_pb from "../codegen/api/api_pb";

interface Options {
    port: number
}

class gRPCService {
    port: number
    // _srv: grpc.Server

    constructor(opt: Options) {
        console.log("init gRPCService with opt: ", opt);

        this.port = opt.port
    }

    serve = () => {
        const _protoPath = '../api/api.proto'
        // const _protoDescriptor: GrpcObject = grpc.load(_protoPath);
        // const service = ;
        let _srv = new grpc.Server()
        _srv.addService(grpc_pb.SocketMServiceService, {
            nspBroadcast: this.nspBroadcast,
            nspRoomsBroadcast: this.nspRoomsBroadcast,
            nspUsersBroadcast: this.nspUsersBroadcast,
            deactive: this.deactive,
            clearRoom: this.clearRoom,
        })
        _srv.bind("0.0.0.0:" + this.port.toString(), grpc.ServerCredentials.createInsecure())
        _srv.start()
    }

    nspBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspBroadcastReq>, cb: grpc.requestCallback<api_pb.NspBroadcastResp>) => {
        let msg = call.request.getMsg()
        let resp = new api_pb.NspBroadcastResp()
        if (!msg) {
            cb(new Error(), resp)
            return
        }
        console.log("broadcast message: ", msg, msg.getId(), msg.getVer());
        resp.setErrcode(0)
        resp.setErrmsg("ok")
        console.log("resp is: ", resp.getErrcode(), resp.getErrmsg());
        cb(null, resp)
    }

    nspRoomsBroadcast = (call: grpc.Call, callback: Function) => {

    }

    nspUsersBroadcast = (call: grpc.Call, callback: Function) => {

    }

    deactive = (call: grpc.Call, callback: Function) => {

    }

    clearRoom = (call: grpc.Call, callback: Function) => {

    }

}

export { gRPCService, Options }