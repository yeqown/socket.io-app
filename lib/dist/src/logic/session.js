"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SManagerBasedRedis = /** @class */ (function () {
    function SManagerBasedRedis(rc) {
        this.rc = rc;
    }
    SManagerBasedRedis.prototype.set = function (socketId, authReq) {
        return null;
    };
    SManagerBasedRedis.prototype.delBySocketId = function (socketId) {
        return null;
    };
    SManagerBasedRedis.prototype.delByUserId = function (userId, nsp) {
        return null;
    };
    SManagerBasedRedis.prototype.queryByUserId = function (userId, nsp) {
        return null;
    };
    SManagerBasedRedis.prototype.queryBySocketId = function (socketId) {
        return null;
    };
    return SManagerBasedRedis;
}());
exports.SManagerBasedRedis = SManagerBasedRedis;
