"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var grpc_1 = __importDefault(require("grpc"));
var api_grpc_pb_1 = __importDefault(require("../codegen/api/api_grpc_pb"));
var api_pb_1 = __importDefault(require("../codegen/api/api_pb"));
var logger_1 = require("../utils/logger");
var codes_1 = require("../utils/codes");
var types_1 = require("../types");
var gRPCService = /** @class */ (function () {
    // _srv: grpc.Server
    function gRPCService(opt, socketioSrv) {
        var _this = this;
        this.serve = function () {
            // const _protoPath = '../api/api.proto'
            // const _protoDescriptor: GrpcObject = grpc.load(_protoPath);
            // const service = ;
            var _srv = new grpc_1.default.Server();
            _srv.addService(api_grpc_pb_1.default.SocketMServiceService, {
                nspBroadcast: _this.nspBroadcast,
                nspRoomsBroadcast: _this.nspRoomsBroadcast,
                nspUsersBroadcast: _this.nspUsersBroadcast,
                deactive: _this.deactive,
                clearRoom: _this.clearRoom,
            });
            _srv.bind("0.0.0.0:" + _this.port.toString(), grpc_1.default.ServerCredentials.createInsecure());
            _srv.start();
        };
        this.nspBroadcast = function (call, cb) {
            var msg = call.request.getMsg();
            var resp = new api_pb_1.default.NspBroadcastResp();
            if (!msg) {
                cb(new Error("empty message"), resp);
                return;
            }
            logger_1.logger.info("broadcast message: ", msg, msg.getId(), msg.getVer());
            resp.setErrcode(codes_1.codes.OK);
            resp.setErrmsg(codes_1.getMessage(codes_1.codes.OK));
            logger_1.logger.info("resp is: ", resp.getErrcode(), resp.getErrmsg());
            cb(null, resp);
        };
        this.nspRoomsBroadcast = function (call, cb) {
            var msgs = call.request.getMsgsList();
            var nspName = call.request.getNspname();
            var resp = new api_pb_1.default.NspBroadcastResp();
            if (!msgs.length || !nspName) {
                cb(new Error("invalid message format"), resp);
                return;
            }
            // fill _msg.getMsg() into RoomsMessage
            var newMsgs = msgs.map(function (msg) {
                // if (!_msg) return null
                return new types_1.proto.RoomsMessage(msg.getRoomid(), new types_1.proto.Message().loadFromPb(msg.getMsg()));
            });
            _this._socketioSrv.broadcastRooms(nspName, newMsgs);
        };
        this.nspUsersBroadcast = function (call, cb) {
            var msgs = call.request.getMsgsList();
            var nspName = call.request.getNspname();
            var resp = new api_pb_1.default.NspBroadcastResp();
            if (!msgs.length || !nspName) {
                cb(new Error("invalid message format"), resp);
                return;
            }
            // fill _msg.getMsg() into UsersMessage
            var newMsgs = msgs.map(function (msg) {
                return new types_1.proto.UsersMessage(msg.getUserid(), new types_1.proto.Message().loadFromPb(msg.getMsg()));
            });
            _this._socketioSrv.broadcastUsers(nspName, newMsgs);
        };
        this.deactive = function (call, cb) {
            // TODO:
            var resp = new api_pb_1.default.NspBroadcastResp();
            cb(null, resp);
        };
        this.clearRoom = function (call, cb) {
            // TODO:
            var resp = new api_pb_1.default.NspBroadcastResp();
            cb(null, resp);
        };
        logger_1.logger.info("init gRPCService with opt: ", opt);
        this.port = opt.port;
        this._socketioSrv = socketioSrv;
    }
    return gRPCService;
}());
exports.gRPCService = gRPCService;
