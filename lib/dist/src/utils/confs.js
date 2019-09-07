"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var logger_1 = require("./logger");
var Config = /** @class */ (function () {
    function Config(confPath) {
        var buf;
        try {
            buf = fs_1.readFileSync(confPath);
        }
        catch (err) {
            logger_1.logger.error("could not readfile sync: ", confPath, "err: ", err);
            throw err;
        }
        var r = JSON.parse(buf.toString());
        var redis = r.redis, mongo = r.mongo, socketio = r.socketio, grpc = r.grpc;
        this.redisOpts = redis || { port: 6379, host: "127.0.0.1" };
        this.mgoOpts = mongo || {};
        this.socketioOpts = socketio || {};
        this.grpcOpts = grpc || {};
        logger_1.logger.info("mgo config: ", this.mgoOpts);
        logger_1.logger.info("redis config: ", this.redisOpts);
    }
    return Config;
}());
exports.Config = Config;
