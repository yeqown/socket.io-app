"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthReq = /** @class */ (function () {
    function AuthReq(userId, token, meta) {
        this.token = token;
        this.userId = userId;
        this.meta = meta;
    }
    return AuthReq;
}());
exports.AuthReq = AuthReq;
var AuthReply = /** @class */ (function () {
    function AuthReply(errcode, errmsg) {
        this.errcode = errcode;
        this.errmsg = errmsg;
    }
    return AuthReply;
}());
exports.AuthReply = AuthReply;
