"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var logger_1 = require("../utils/logger");
var EventType;
(function (EventType) {
    EventType["On"] = "connect";
    EventType["Off"] = "disconnect";
})(EventType || (EventType = {}));
exports.EventType = EventType;
var OnoffMsg = /** @class */ (function () {
    function OnoffMsg(token, meta, evtTyp, socketId, clientIp) {
        /**
         * validate
         * validate the onoff message wtih standard rules
         * TODO:
         */
        this.validate = function () {
            return null;
        };
        this.token = token;
        this.meta = meta;
        this.evtTyp = evtTyp;
        this.evtTimestamp = utils_1.getNowTimestamp();
        this.socketId = socketId;
        this.clientIp = clientIp;
    }
    return OnoffMsg;
}());
exports.OnoffMsg = OnoffMsg;
var OnoffEmitterBasedMQ = /** @class */ (function () {
    function OnoffEmitterBasedMQ() {
        this._mqConn = null;
    }
    OnoffEmitterBasedMQ.prototype.off = function (nspName, data) {
        // TODO:
        throw new Error("Method not implemented.");
    };
    OnoffEmitterBasedMQ.prototype.on = function (nspName, data) {
        // TODO:
        throw new Error("Method not implemented.");
    };
    return OnoffEmitterBasedMQ;
}());
exports.OnoffEmitterBasedMQ = OnoffEmitterBasedMQ;
var OnoffEmitterBasedRedis = /** @class */ (function () {
    function OnoffEmitterBasedRedis(rc) {
        this.rc = rc;
    }
    /**
     *
     * @param nspName
     * @param data
     */
    OnoffEmitterBasedRedis.prototype.off = function (nspName, data) {
        var ch = OnoffEmitterBasedRedis._genTopic(nspName);
        // data.evtTyp = EventType.Off
        this.rc.publish(ch, JSON.stringify(data), function (err, reply) {
            if (err) {
                logger_1.logger.error("could not publish to %s with err: %v", ch, err);
                return;
            }
            else {
                logger_1.logger.info("publish to %s get result code: %d", ch, reply);
            }
        });
    };
    /**
     *
     * @param nspName
     * @param data
     */
    OnoffEmitterBasedRedis.prototype.on = function (nspName, data) {
        var ch = OnoffEmitterBasedRedis._genTopic(nspName);
        // data.evtTyp = EventType.On
        this.rc.publish(ch, JSON.stringify(data), function (err, reply) {
            if (err) {
                logger_1.logger.error("could not publish to %s with err: %v", ch, err);
                return;
            }
            else {
                logger_1.logger.info("publish to %s get result code: %d", ch, reply);
            }
        });
    };
    /**
     *
     * @param nspName
     */
    OnoffEmitterBasedRedis._genTopic = function (nspName) {
        if (nspName === '') {
            throw new Error("nspName could not be empty");
        }
        return nspName + "/onoff";
    };
    return OnoffEmitterBasedRedis;
}());
exports.OnoffEmitterBasedRedis = OnoffEmitterBasedRedis;
