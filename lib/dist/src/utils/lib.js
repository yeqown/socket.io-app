"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * getNowTimestamp get timestamp (ms)
 */
exports.getNowTimestamp = function () {
    return new Date().getTime();
};
/**
 * rmSlashLeft if s starts with '/'
 * @param s
 */
exports.rmSlashLeft = function (s) {
    if (s[0] !== "/")
        return s;
    return s.slice(1);
};
/**
 * addSlashLeft if s not start with '/'
 * @param s
 */
exports.addSlashLeft = function (s) {
    if (s[0] !== "/")
        return "/" + s;
    return s;
};
