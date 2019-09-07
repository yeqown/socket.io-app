"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var utils_1 = require("../utils");
var DesTokenr = /** @class */ (function () {
    function DesTokenr() {
        this._des = new utils_1.Des(DesTokenr.alg, DesTokenr.key, DesTokenr.iv);
    }
    /**
     *
     * @param userId
     * @param meta
     */
    DesTokenr.prototype.gen = function (userId, meta) {
        var tok = this._des.encrypt(JSON.stringify(meta));
        return new types_1.AuthReq(userId, tok, meta);
    };
    /**
     *
     * @param req
     */
    DesTokenr.prototype.verify = function (req) {
        var encrypted = this._des.encrypt(JSON.stringify(req.meta));
        // let reply: IAuthReply
        if (req.token === encrypted) {
            return new types_1.AuthReply(utils_1.codes.OK, utils_1.getMessage(utils_1.codes.OK));
        }
        return new types_1.AuthReply(utils_1.codes.TokenInvalid, utils_1.getMessage(utils_1.codes.TokenInvalid));
    };
    DesTokenr.alg = utils_1.DesAlgorithm.CBC;
    DesTokenr.key = "kV2CfasTWPmkHwfvoaE6eY";
    DesTokenr.iv = "3hjaueLWe+YUoiOhnnzo2Y";
    return DesTokenr;
}());
exports.DesTokenr = DesTokenr;
