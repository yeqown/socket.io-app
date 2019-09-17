import grpc, { GrpcObject } from "grpc"
import grpc_pb from '../codegen/api/api_grpc_pb'
import api_pb from "../codegen/api/api_pb";
import { logger, redisClient } from '../utils/ins'
import { SocketioWrapper } from "./socketio";
import { proto, GrpcServerOptions, codes, getMessage } from "../types";
import { RedisClient, createClient, ClientOpts as RedisOpts } from "redis";

enum rpcCommandEvt {
    nspBroadcast = "nspbroadcast",
    nspBroadcastRooms = "nspbroadcastrooms",
    nspBroadcastUsers = "nspbroadcastusers",
    knockout = "knockout",
    disconnect = "disconnect",
    clearRooms = "clearrooms"
}
interface IRpcCommand {
    evt: rpcCommandEvt
    meta: any
}

interface broadcastMeta {
    nspName: string
    msg: proto.IMessage
}

interface broadcastRoomsMeta {
    nspName: string
    msgs: proto.IRoomsMessage[]
}

interface broadcastUsersMeta {
    nspName: string
    msgs: proto.IUsersMessage[]
}

interface disconnectMeta {
    nspName: string
    userId: number
}

interface knockoutFromRoomMeta {
    nspName: string
    metas: proto.IKnockoutMeta[]
}

interface clearRoomMeta {
    nspName: string
    roomIds: string[]
}

// let logger = logger('grpc.ts')
class gRPCService {
    /**
     * based redis PUB/SUB to support command dispensing
     * define Command and split logic
     */

    port: number
    _socketioSrv: SocketioWrapper
    _rc: RedisClient
    _pub: RedisClient
    _sub: RedisClient
    // _srv: grpc.Server

    constructor(opt: GrpcServerOptions, socketioSrv: SocketioWrapper, redisOpts: RedisOpts) {
        logger.info("init gRPCService with opt: ", opt);
        this.port = opt.port
        this._socketioSrv = socketioSrv
        this._rc = redisClient
        this._pub = createClient(redisOpts)
        this._sub = createClient(redisOpts)
    }

    pubsubTopic = (): string => {
        return "app#grpc:commands"
    }

    private _call(command: IRpcCommand) {
        switch (command.evt) {
            case rpcCommandEvt.nspBroadcast:
                let d1: broadcastMeta = command.meta as broadcastMeta
                this._nspBroadcast(d1.nspName, d1.msg)
                break
            case rpcCommandEvt.nspBroadcastRooms:
                let d2: broadcastRoomsMeta = command.meta as broadcastRoomsMeta
                this._nspRoomsBroadcast(d2.nspName, d2.msgs)
                break
            case rpcCommandEvt.nspBroadcastUsers:
                let d3: broadcastUsersMeta = command.meta as broadcastUsersMeta
                this._nspUsersBroadcast(d3.nspName, d3.msgs)
                break
            case rpcCommandEvt.disconnect:
                let d4: disconnectMeta = command.meta as disconnectMeta
                this._disconnect(d4.nspName, d4.userId)
                break
            case rpcCommandEvt.knockout:
                let d5: knockoutFromRoomMeta = command.meta as knockoutFromRoomMeta
                this._knockoutFromRoom(d5.nspName, d5.metas)
                break
            case rpcCommandEvt.clearRooms:
                let d6: clearRoomMeta = command.meta as clearRoomMeta
                this._clearRooms(d6.nspName, d6.roomIds)
                break
            default:
                logger.error("undefined command evt")
        }
    }

    /**
     * _subcribeCommandsToRedis
     * recv all command from redis `pub/sub` and execute
     */
    private _subcribeCommandsToRedis() {
        this._sub.on("message", (ch: string, message: string) => {
            logger.info("recv an command from: ", ch, message)
            try {
                let command: IRpcCommand = JSON.parse(message)
                this._call(command)
            } catch (error) {
                logger.error("could not execute message command: ", error)
            }
        })

        this._sub.SUBSCRIBE(this.pubsubTopic())
    }

    /**
     * _publishCommandsToRedis
     * publish commands into `pub/sub`
     */
    private _publishCommandsToRedis(evt: rpcCommandEvt, meta: any) {
        let command: IRpcCommand = {
            evt: evt,
            meta: meta,
        }
        this._pub.publish(this.pubsubTopic(), JSON.stringify(command))
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
        // start subscribe commands
        this._subcribeCommandsToRedis()

        _srv.bind("0.0.0.0:" + this.port.toString(), grpc.ServerCredentials.createInsecure())
        _srv.start()
    }

    _nspBroadcast = (nspName: string, msg: proto.IMessage) => {
        this._socketioSrv.broadcast(nspName, msg)
    }

    nspBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspBroadcastReq>, cb: grpc.requestCallback<api_pb.NspBroadcastResp>) => {
        let msg = call.request.getMsg()
        let nspName = call.request.getNspname()
        let resp = new api_pb.NspBroadcastResp()
        if (!msg) {
            let err = new Error("invalid message format")
            resp.setErrcode(codes.ParamInvalid)
            resp.setErrmsg(err.message)
            cb(null, resp)
            return
        }

        let meta: broadcastMeta = {
            nspName,
            msg: proto.loadFromPbMessage(msg)
        }
        this._publishCommandsToRedis(rpcCommandEvt.nspBroadcast, meta)

        logger.info("broadcast message: ", msg, msg.getId(), msg.getVer());
        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    /**
     * std call
     */
    _nspRoomsBroadcast = (nspName: string, msgs: proto.IRoomsMessage[]) => {
        // fill _msg.getMsg() into RoomsMessage
        // let newMsgs = msgs.map((msg: proto.IRoomsMessage): proto.IRoomsMessage => {
        //     // if (!_msg) return null
        //     return new proto.RoomsMessage(nspName, msg.getRoomid(),
        //         new proto.Message().loadFromPb(msg.getMsg()))
        // })

        this._socketioSrv.broadcastRooms(nspName, msgs)
    }

    /**
     * rpc call
     */
    nspRoomsBroadcast = (call: grpc.ServerUnaryCall<api_pb.NspRoomsBroadcastReq>, cb: grpc.requestCallback<api_pb.NspRoomsBroadcastResp>) => {
        let msgs = call.request.getMsgsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.NspRoomsBroadcastResp()
        if (!msgs.length || !nspName) {
            // let err = new Error("invalid message format")
            resp.setErrcode(codes.ParamInvalid)
            resp.setErrmsg(getMessage(codes.ParamInvalid))
            cb(null, resp)
            return
        }

        let _msgs = msgs.map((v: api_pb.RoomMessage): proto.IRoomsMessage => {
            return {
                roomId: v.getRoomid(),
                msg: proto.loadFromPbMessage(v.getMsg()),
                nspName: nspName,
            }
        })

        let meta: broadcastRoomsMeta = { nspName, msgs: _msgs }
        this._publishCommandsToRedis(rpcCommandEvt.nspBroadcastRooms, meta)

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    _nspUsersBroadcast = (nspName: string, msgs: proto.IUsersMessage[]) => {
        // fill _msg.getMsg() into UsersMessage
        // let newMsgs = msgs.map((msg: api_pb.UserMessage) => {
        //     return new proto.UsersMessage(nspName, msg.getUserid(),
        //         new proto.Message().loadFromPb(msg.getMsg()))
        // })

        this._socketioSrv.broadcastUsers(nspName, msgs)
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

        let _msgs = msgs.map((v: api_pb.UserMessage): proto.IUsersMessage => {
            return {
                nspName: nspName,
                userId: v.getUserid(),
                msg: proto.loadFromPbMessage(v.getMsg()),
            }
        })

        let meta: broadcastUsersMeta = { nspName, msgs: _msgs }
        this._publishCommandsToRedis(rpcCommandEvt.nspBroadcastUsers, meta)

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }


    _disconnect = (nspName: string, userId: number) => {
        this._socketioSrv.deactiveByUserId(nspName, userId)
    }

    /**
     * disconnect
     * server-side disconnect with client
     */
    disconnect = (call: grpc.ServerUnaryCall<api_pb.DisconnectReq>, cb: grpc.requestCallback<api_pb.DisconnectResp>) => {
        let nspName = call.request.getNspname()
        let userId = call.request.getUserid()
        let resp = new api_pb.DisconnectResp()

        let meta: disconnectMeta = { nspName, userId }
        this._publishCommandsToRedis(rpcCommandEvt.disconnect, meta)

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    private _knockoutFromRoom = (nspName: string, metas: proto.IKnockoutMeta[]) => {
        metas.forEach((meta: proto.IKnockoutMeta) => {
            this._socketioSrv.knockoutFromRoom(nspName, meta.roomId, meta.userId)
        })
    }
    /**
     * deactiveFromRoom 
     * support multi
     */
    knockoutFromRoom = (call: grpc.ServerUnaryCall<api_pb.KnockoutReq>, cb: grpc.requestCallback<api_pb.KnockoutResp>) => {
        let nspName = call.request.getNspname()
        let metas = call.request.getMetasList()
        let resp = new api_pb.KnockoutResp()

        let _metas = metas.map((mt: api_pb.KnockoutMeta): proto.IKnockoutMeta => {
            return {
                userId: mt.getUserid(),
                roomId: mt.getRoomid(),
            }
        })
        let meta: knockoutFromRoomMeta = { nspName: nspName, metas: _metas }
        this._publishCommandsToRedis(rpcCommandEvt.knockout, meta)

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

    private _clearRooms = (nspName: string, roomIds: string[]) => {
        this._socketioSrv.clearRooms(nspName, roomIds)
    }

    /**
     * clearRoom
     */
    clearRooms = (call: grpc.ServerUnaryCall<api_pb.ClearRoomsReq>, cb: grpc.requestCallback<api_pb.ClearRoomsResp>) => {
        let roomIds = call.request.getRoomidsList()
        let nspName = call.request.getNspname()
        let resp = new api_pb.ClearRoomsResp()

        let meta: clearRoomMeta = { nspName, roomIds }
        this._publishCommandsToRedis(rpcCommandEvt.clearRooms, meta)

        resp.setErrcode(codes.OK)
        resp.setErrmsg(getMessage(codes.OK))
        cb(null, resp)
    }

}

export { gRPCService }