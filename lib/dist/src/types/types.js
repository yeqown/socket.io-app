"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Session = /** @class */ (function () {
    function Session(req, nsp, socketId, clientIp) {
        this.userId = req && req.userId || 0;
        this.meta = req && req.meta || {};
        this.token = req && req.token || "";
        this.socketId = socketId || "";
        this.clientIp = clientIp || "";
        this.nsp = nsp || "";
    }
    Session.prototype._toObject = function () {
        return new Object({
            userId: this.userId,
            socketId: this.socketId,
            clientIp: this.clientIp,
            token: this.token,
            nsp: this.nsp,
            meta: this.meta,
        });
    };
    Session.prototype.marshal = function () {
        return JSON.stringify(this._toObject());
    };
    Session.prototype.unmarshal = function (d) {
        // console.log("unmarshal session form: ", d);
        try {
            var _a = JSON.parse(d), userId = _a.userId, socketId = _a.socketId, clientIp = _a.clientIp, token = _a.token, nsp = _a.nsp, meta = _a.meta;
            this.userId = userId;
            this.socketId = socketId;
            this.clientIp = clientIp;
            this.token = token;
            this.nsp = nsp;
            this.meta = meta;
        }
        catch (err) {
            throw err;
        }
        return this;
    };
    return Session;
}());
exports.Session = Session;
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
var Response = /** @class */ (function () {
    function Response(errcode, errmsg, data) {
        this.errcode = errcode || utils_1.codes.OK;
        this.errmsg = errmsg || utils_1.getMessage(this.errcode);
        if (!data) {
            this.data == null;
        }
        else {
            this.data = data;
        }
    }
    return Response;
}());
exports.Response = Response;
