"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codes;
(function (codes) {
    codes[codes["Undefined"] = -1] = "Undefined";
    codes[codes["OK"] = 0] = "OK";
    codes[codes["ServerErr"] = 1] = "ServerErr";
    codes[codes["ParamInvalid"] = 2] = "ParamInvalid";
    codes[codes["TokenInvalid"] = 3] = "TokenInvalid";
    codes[codes["AuthTimeout"] = 4] = "AuthTimeout";
})(codes = exports.codes || (exports.codes = {}));
var _messages = new Map();
(function (m) {
    m.set(codes.Undefined, "undefined code");
    m.set(codes.OK, "ok");
    m.set(codes.ServerErr, "server err");
    m.set(codes.ParamInvalid, "param invalid");
    m.set(codes.TokenInvalid, "token invalid");
    m.set(codes.AuthTimeout, "auth timeout");
}(_messages));
exports.getMessage = function (code) {
    var v = _messages.get(code);
    if (v === undefined) {
        return _messages.get(codes.Undefined);
    }
    return v;
};
