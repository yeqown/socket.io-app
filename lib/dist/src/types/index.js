"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var proto = __importStar(require("./proto"));
exports.proto = proto;
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
