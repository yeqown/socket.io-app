import grpc, { GrpcObject } from "grpc"
import grpc_pb from '../codegen/api/api_grpc_pb'
import api_pb from "../codegen/api/api_pb";
import { logger } from '../utils/logger'
import { codes, getMessage } from '../utils/codes'
import { SocketioWrapper } from "./socketio";
import { proto } from "../types";

interface Options {
    port: number
}

class gRPCService {
    port: number
    _socketioSrv: SocketioWrapper
    // _srv: grpc.Server

    constructor(opt: Options, socketioSrv: SocketioWrapper) {
        logger.info("init gRPCService with opt: ", opt);
        this.port = opt.port
        this._socketioSrv = socketioSrv
    }

    serve = () => {
        // const _protoPath = '../api/api.proto'
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
            cb(new Error("empty message"), resp)
            return
        }
        logger.info("broadcast message: ", msg, msg.getId(), msg.getVer());
        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        logger.info("resp is: ", resp.getErrcode(), resp.getErrmsg());
        cb(null, resp)
    }

    nspRoomsBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspRoomsBroadcastReq>, cb: grpc.requestCallback<api_pb.NspRoomsBroadcastResp>) => {
        let msgs = call.request.getMsgsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.NspBroadcastResp()
        if (!msgs.length || !nspName) {
            cb(new Error("invalid message format"), resp)
            return
        }

        // fill _msg.getMsg() into RoomsMessage
        let newMsgs = msgs.map((msg: api_pb.RoomMessage): proto.IRoomsMessage => {
            // if (!_msg) return null
            return new proto.RoomsMessage(msg.getRoomid(),
                new proto.Message().loadFromPb(msg.getMsg()))
        })

        this._socketioSrv.broadcastRooms(nspName, newMsgs)
    }

    nspUsersBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspUsersBroadcastReq>, cb: grpc.requestCallback<api_pb.NspUsersBroadcastResp>) => {
        let msgs = call.request.getMsgsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.NspBroadcastResp()
        if (!msgs.length || !nspName) {
            cb(new Error("invalid message format"), resp)
            return
        }

        // fill _msg.getMsg() into UsersMessage
        let newMsgs = msgs.map((msg: api_pb.UserMessage) => {
            return new proto.UsersMessage(msg.getUserid(),
                new proto.Message().loadFromPb(msg.getMsg()))
        })

        this._socketioSrv.broadcastUsers(nspName, newMsgs)
    }

    deactive = (call: grpc.ServerUnaryCall<api_pb.DeactiveReq>, cb: grpc.requestCallback<api_pb.DeactiveResp>) => {
        // TODO:
        let resp = new api_pb.NspBroadcastResp()
        cb(null, resp)
    }

    clearRoom = (call: grpc.ServerUnaryCall<api_pb.ClearRoomReq>, cb: grpc.requestCallback<api_pb.ClearRoomResp>) => {
        // TODO:
        let resp = new api_pb.NspBroadcastResp()
        cb(null, resp)
    }

}

export { gRPCService, Options }