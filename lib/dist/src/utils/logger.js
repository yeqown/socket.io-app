"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log4js_1 = __importDefault(require("log4js"));
exports.configureLogger = function (conf) {
    var NODE_ENV = process.env.NODE_ENV;
    log4js_1.default.configure(conf);
    if (NODE_ENV && NODE_ENV === 'dev') {
        exports.logger = log4js_1.default.getLogger("default");
    }
    else {
        exports.logger = log4js_1.default.getLogger("file");
    }
};
