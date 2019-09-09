"use strict";
// File global/ins.go
// Author: yeqown
// Date: 190905
// refer to https://github.com/NodeRedis/node_redis
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import bluebird from 'bluebird'
// import * as redis from 'redis'
var redis_1 = require("redis");
var log4js_1 = __importDefault(require("log4js"));
// import { Config } from '../utils/confs'
// import { promisify } from 'util'
// add promise to all redis-client functions
// bluebird.promisifyAll(RedisClient);
// let redisClient: RedisClient
// let mqClient: NSQClient
var redisClient;
exports.redisClient = redisClient;
var initialRedis = function (opt) {
    // let redisClientOpts: ClientOpts = {
    //     port: opt.port,
    //     host: opt.host,
    // }
    try {
        exports.redisClient = redisClient = redis_1.createClient(opt);
    }
    catch (err) {
        logger.error("could not create redis client", err);
    }
    // const getAsync = promisify(redisClient.get).bind(redisClient)
    // redisClientAsync = {
    //     client: redisClient,
    //     getAsync: getAsync,
    // }
};
exports.initialRedis = initialRedis;
var logger;
exports.logger = logger;
var configureLogger = function (conf) {
    var NODE_ENV = process.env.NODE_ENV;
    try {
        log4js_1.default.configure(conf);
        if (NODE_ENV && NODE_ENV === 'dev') {
            exports.logger = logger = log4js_1.default.getLogger("default");
        }
        else {
            exports.logger = logger = log4js_1.default.getLogger("file");
        }
        return logger;
    }
    catch (err) {
        console.log("could not configure logger: ", err);
    }
    return null;
};
exports.configureLogger = configureLogger;
