"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var logger_1 = require("../utils/logger");
var Message = /** @class */ (function () {
    function Message(meta, ver, id, evt) {
        if (ver === void 0) { ver = '1.0.0'; }
        if (id === void 0) { id = ''; }
        if (evt === void 0) { evt = 'message'; }
        this.ver = ver;
        this.id = id || uuid_1.v4();
        this.evt = evt;
        this.meta = JSON.stringify(meta);
    }
    Message.prototype.loadFromPb = function (pbm) {
        if (pbm === undefined) {
            logger_1.logger.error("meet an undefined api_pb.Message");
            return this;
        }
        this.meta = pbm.getMeta();
        this.ver = pbm.getVer();
        this.evt = pbm.getEvt();
        this.id = pbm.getId() || uuid_1.v4();
        return this;
    };
    return Message;
}());
exports.Message = Message;
var RoomsMessage = /** @class */ (function () {
    function RoomsMessage(roomId, msg) {
        this.roomId = roomId;
        this.msg = msg;
    }
    return RoomsMessage;
}());
exports.RoomsMessage = RoomsMessage;
var UsersMessage = /** @class */ (function () {
    function UsersMessage(userId, msg) {
        this.userId = userId;
        this.msg = msg;
    }
    return UsersMessage;
}());
exports.UsersMessage = UsersMessage;
