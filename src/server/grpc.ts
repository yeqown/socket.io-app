import grpc, { GrpcObject } from "grpc"
import grpc_pb from '../codegen/api/api_grpc_pb'
import api_pb from "../codegen/api/api_pb";
import { logger } from '../utils/ins'
import { SocketioWrapper } from "./socketio";
import { proto, GrpcServerOptions, codes, getMessage } from "../types";

// let logger = logger('grpc.ts')

class gRPCService {
    /**
     * TODO: based redis PUB/SUB to support command dispensing
     */

    port: number
    _socketioSrv: SocketioWrapper
    // _srv: grpc.Server

    constructor(opt: GrpcServerOptions, socketioSrv: SocketioWrapper) {
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
            disconnect: this.disconnect,
            knockoutFromRoom: this.knockoutFromRoom,
            clearRooms: this.clearRooms,
        })
        _srv.bind("0.0.0.0:" + this.port.toString(), grpc.ServerCredentials.createInsecure())
        _srv.start()
    }

    nspBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspBroadcastReq>, cb: grpc.requestCallback<api_pb.NspBroadcastResp>) => {
        let msg = call.request.getMsg()
        let resp = new api_pb.NspBroadcastResp()
        if (!msg) {
            let err = new Error("invalid message format")
            resp.setErrcode(codes.ParamInvalid)
            resp.setErrmsg(err.message)
            cb(null, resp)
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
            let err = new Error("invalid message format")
            resp.setErrcode(codes.ParamInvalid)
            resp.setErrmsg(err.message)
            cb(null, resp)
            return
        }

        // fill _msg.getMsg() into RoomsMessage
        let newMsgs = msgs.map((msg: api_pb.RoomMessage): proto.IRoomsMessage => {
            // if (!_msg) return null
            return new proto.RoomsMessage(nspName, msg.getRoomid(),
                new proto.Message().loadFromPb(msg.getMsg()))
        })

        this._socketioSrv.broadcastRooms(nspName, newMsgs)
    }

    nspUsersBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspUsersBroadcastReq>, cb: grpc.requestCallback<api_pb.NspUsersBroadcastResp>) => {
        logger.info("recv rpc request: ", call.request)
        let msgs = call.request.getMsgsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.NspUsersBroadcastResp()
        if (!msgs.length || !nspName) {
            let err = new Error("invalid message format")
            resp.setErrcode(codes.ParamInvalid)
            resp.setErrmsg(err.message)
            cb(null, resp)
            return
        }

        // fill _msg.getMsg() into UsersMessage
        let newMsgs = msgs.map((msg: api_pb.UserMessage) => {
            return new proto.UsersMessage(nspName, msg.getUserid(),
                new proto.Message().loadFromPb(msg.getMsg()))
        })

        this._socketioSrv.broadcastUsers(nspName, newMsgs)
        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    /**
     * disconnect
     * server-side disconnect with client
     */
    disconnect = (call: grpc.ServerUnaryCall<api_pb.DisconnectReq>, cb: grpc.requestCallback<api_pb.DisconnectResp>) => {
        let nspName = call.request.getNspname()
        let userId = call.request.getUserid()
        let resp = new api_pb.DisconnectResp()

        this._socketioSrv.deactiveByUserId(nspName, userId)
        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    /**
     * deactiveFromRoom 
     * support multi
     */
    knockoutFromRoom = (call: grpc.ServerUnaryCall<api_pb.KnockoutReq>, cb: grpc.requestCallback<api_pb.KnockoutResp>) => {
        let nspName = call.request.getNspname()
        let metas = call.request.getMetasList()
        let resp = new api_pb.KnockoutResp()

        metas.forEach((meta: api_pb.KnockoutMeta) => {
            this._socketioSrv.knockoutFromRoom(nspName, meta.getRoomid(), meta.getUserid())
        })

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    /**
     * clearRoom
     */
    clearRooms = (call: grpc.ServerUnaryCall<api_pb.ClearRoomsReq>, cb: grpc.requestCallback<api_pb.ClearRoomsResp>) => {
        let roomIds = call.request.getRoomidsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.ClearRoomsResp()

        this._socketioSrv.clearRooms(nspName, roomIds)
        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

}

export { gRPCService }