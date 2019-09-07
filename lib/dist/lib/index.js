"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../src/types");
var logic_1 = require("../src/logic");
// import SocketIOClient from 'socket.io-client'
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var Client = /** @class */ (function () {
    function Client(addr, opt, cbs) {
        var _this = this;
        this._des = new logic_1.DesTokenr();
        // console.log(addr, opt, cbs);
        this._socket = socket_io_client_1.default(addr, opt);
        this._socket.on("logic/error", function (err) {
            console.log("recv an error: ", err);
        });
        cbs.forEach(function (evtCb) {
            _this._socket.on(evtCb.evt, evtCb.cb);
        });
    }
    Client.prototype.auth = function (userId, meta, cb) {
        var req = this._des.gen(userId, meta);
        // let req: IAuthReq = new AuthReq(userId, tok, meta)
        this._socket.emit("auth", req);
        this._socket.once("auth/reply", cb);
    };
    Client.prototype.join = function (req, cb) {
        this._socket.emit("join", req);
        this._socket.once("join/reply", cb);
    };
    Client.prototype.sendInRoom = function (roomId, meta) {
        // let meta = { content: }
        var msg = new types_1.proto.Message(meta);
        msg.evt = 'chat/rooms';
        var roomsMsg = new types_1.proto.RoomsMessage(roomId, msg);
        try {
            this._socket.emit("chat/rooms", [roomsMsg]);
        }
        catch (err) {
            throw err;
        }
    };
    Client.prototype.sendToUser = function (userId, meta) {
        var msg = new types_1.proto.Message(meta);
        msg.evt = "chat/users";
        var usersMsg = new types_1.proto.UsersMessage(userId, msg);
        try {
            this._socket.emit("chat/users", [usersMsg]);
        }
        catch (err) {
            throw err;
        }
    };
    return Client;
}());
exports.Client = Client;
