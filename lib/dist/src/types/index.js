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
var types_1 = require("./types");
exports.AuthReply = types_1.AuthReply;
exports.AuthReq = types_1.AuthReq;