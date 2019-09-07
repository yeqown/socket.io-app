"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codes_1 = require("./codes");
exports.codes = codes_1.codes;
exports.getMessage = codes_1.getMessage;
// import { logger, configureLogger } from './logger'
// import { Logger } from 'log4js'
var confs_1 = require("./confs");
exports.Config = confs_1.Config;
var des_1 = require("./des");
exports.Des = des_1.Des;
exports.DesAlgorithm = des_1.DesAlgorithm;
/**
 * getNowTimestamp get timestamp (ms)
 */
var getNowTimestamp = function () {
    return new Date().getTime();
};
exports.getNowTimestamp = getNowTimestamp;
