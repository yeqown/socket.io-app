"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { proto } from "@/types"
// import express from 'express'
var socket_io_1 = __importDefault(require("socket.io"));
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var logic_1 = require("../logic");
var utils_1 = require("../utils");
var logger_1 = require("../utils/logger");
var _logicErrorEvt = "logic/error";
var SocketWrapper = /** @class */ (function () {
    function SocketWrapper(socket, req) {
        this._socket = socket;
        this._authreq = req;
    }
    SocketWrapper.prototype.getSocket = function () {
        return this._socket;
    };
    SocketWrapper.prototype.getUserId = function () {
        return this._authreq.userId;
    };
    SocketWrapper.prototype.getMeta = function () {
        return this._authreq.meta;
    };
    SocketWrapper.prototype.getToken = function () {
        return this._authreq.token;
    };
    return SocketWrapper;
}());
/**
 * SocketioWrapper provides some simpe methods and calls logic
 * meta to control the process
 * 1. control nsp and and it's config
 * 2. listen on evt for nsp, and call logic
 * 3. manage session
 */
var SocketioWrapper = /** @class */ (function () {
    function SocketioWrapper(opt, rc) {
        var _this = this;
        /**
         * creata an Nsp and listen evt on it
         */
        this.createNsp = function (nspCfg) {
            var _nsp = _this._nsps.get(nspCfg.name);
            if (_nsp === undefined) {
                var err = new Error("duplicate nsp name");
                logger_1.logger.error("could not create a Nsp with error:", err);
                return err;
            }
            try {
                _this._nspConfiger.applyFor(nspCfg);
            }
            catch (err) {
                logger_1.logger.error("coule not apply for a Nsp with error: ", err);
                return err;
            }
            return null;
        };
        /**
         * rmeove an Nsp [Nsp event & Nsp]
         * @param nspName
         */
        this.removeNsp = function (nspName) {
            var _nsp = _this._nsps.get(nspName);
            if (_nsp === undefined) {
                var err = new Error("undefined nsp");
                return err;
            }
            _nsp.removeAllListeners();
            _this._nsps.delete(nspName);
            delete _this._io.nsps[nspName];
            return null;
        };
        this._mountNsps = function () {
            var nspCfgs = _this._nspConfiger.allNsp();
            nspCfgs.forEach(function (cfg) {
                if (_this._nsps.get(cfg.name)) {
                    logger_1.logger.error("duplicate nsp name config: ", cfg.name);
                    return;
                }
                // register handlers
                logger_1.logger.info("generate nsp name: ", cfg.name, "evts:", cfg.listenEvts);
                var _nsp = _this._io.of(cfg.name);
                // TODO: using middleware
                // _nsp.use((socket: io.Socket, next: (err?: any) => void): void => {
                //     next()
                // })
                _nsp.on("connection", function (socket) {
                    logger_1.logger.info("a new socket incomming, and it's socketId is: %s, nspName: %s", socket.id, socket.nsp.name);
                    _this._hdlSocketConn(_nsp, socket, cfg);
                });
                // record nsp
                _this._nsps.set(cfg.name, _nsp);
            });
            // refused all connection to root Nsp
            _this._io.of(new RegExp("^\/$")).on("connection", function (socket) {
                if (socket.connected) {
                    logger_1.logger.error("connection refused: could not use root nsp, nspName is: ", socket.nsp.name);
                    socket.emit(_logicErrorEvt, new Error("connection refused"));
                }
                socket.disconnect();
            });
        };
        /**
         * hdl socket with it's evt
         * @param _nsp
         * @param socket
         * TODO: handle more event:
         * refer to: https://socket.io/docs/client-api/#Event-%E2%80%98connect-error%E2%80%99
         */
        this._hdlSocketConn = function (_nsp, socket, cfg) {
            // auth req timeout
            setTimeout(function () {
                if (_this._authed(socket.id)) {
                    // has authed, break
                    return;
                }
                // send an timeout error to client
                logger_1.logger.error("connection refused: auth timeout");
                socket.emit(_logicErrorEvt, new Error(utils_1.getMessage(utils_1.codes.AuthTimeout)));
                socket.disconnect();
            }, 5000);
            // hdl disconnect evt
            socket.on("disconnect", function () {
                logger_1.logger.info("a socket disconnected, and it's socketId is: ", socket.id, "args: ", null);
                var _socket = _this._sockets.get(socket.id);
                if (_socket) {
                    // if has authed
                    socket.leaveAll();
                    // remove from _sockets
                    _this._sockets.delete(socket.id);
                    // fill OnoffMsg with actual data
                    var onoff = new logic_1.OnoffMsg(_socket.getToken(), _socket.getMeta(), logic_1.EventType.Off, socket.id, socket.handshake.address);
                    _this._onoffEmitter.on(_nsp.name, onoff);
                    // TODO: call session manager
                }
            });
            socket.on("auth", function (req) {
                logger_1.logger.info("auth socketId: ", socket.id, "args:", req);
                // call Auth Logic
                var reply = _this._auth.verify(req);
                socket.emit("auth/reply", reply);
                if (reply.errcode == utils_1.codes.OK) {
                    // true: auth success
                    // save socketid to socket and req meta
                    _this._sockets.set(socket.id, new SocketWrapper(socket, req));
                    // fill OnoffMsg with actual data
                    var onoff = new logic_1.OnoffMsg(req.token, req.meta, logic_1.EventType.On, socket.id, socket.handshake.address);
                    _this._onoffEmitter.on(_nsp.name, onoff);
                    // TODO: call session manager
                }
                else {
                    // auth failed
                    socket.disconnect();
                }
            });
            socket.on("join", function (req) {
                logger_1.logger.info("recv join evt: ", socket.id, req);
                req.rooms.forEach(function (joinRoomReq) {
                    logger_1.logger.info("socket join room", joinRoomReq.roomId);
                    socket.join(joinRoomReq.roomId);
                });
            });
            socket.on("chat/users", function (uMsgs) {
                logger_1.logger.info("chat/users recv msg: ", uMsgs);
                uMsgs.forEach(function (msg) {
                    var _sockid = msg.userId.toString();
                    var _socket = _this._sockets.get(_sockid);
                    if (_socket)
                        _socket.getSocket().emit(msg.msg.evt, msg.msg);
                });
            });
            socket.on("chat/rooms", function (rMsgs) {
                logger_1.logger.info("recv broadcast_rooms msg", rMsgs);
                rMsgs.forEach(function (msg) {
                    _nsp.in(msg.roomId).emit(msg.msg.evt, msg.msg);
                });
            });
            // listening custom evt and mount
            cfg.listenEvts.forEach(function (evt) {
                socket.on(evt, function (data) {
                    if (!_this._authed(socket.id)) {
                        // true: not authed client should not be allowed to send any msg
                        logger_1.logger.error("connection refused: not authed");
                        socket.emit(_logicErrorEvt, new Error("not authed"));
                    }
                    logger_1.logger.info("evt: ", evt, "data: ", data);
                });
            });
        };
        /**
        * open socket.io server
        * 1. createNsp from configs , if no configs just skip this step
        * 2. serving nsps
        */
        this.serve = function () {
            _this._httpSrv.listen(_this.port, function () {
                logger_1.logger.info("running on: ", _this.port);
            });
        };
        this._mountHandlers = function () {
            _this._app.get("/api/nsps/all", _this.hdlGetAllNsps);
            _this._app.get("/api/nsps/:nspName", _this.hdlGetNsp);
        };
        this.broadcast = function (nspName, msg) {
            var _nsp = _this._nsps.get(nspName);
            if (_nsp === undefined) {
                logger_1.logger.error("could not get nsp by name: ", nspName);
                return;
            }
            _nsp.emit(msg.evt, msg);
        };
        this.broadcastRooms = function (nspName, msgs) {
            var _nsp = _this._nsps.get(nspName);
            if (_nsp === undefined) {
                logger_1.logger.error("could not get nsp by name: ", nspName);
                return;
            }
            msgs.forEach(function (rMsg) {
                _nsp.in(rMsg.roomId).emit(rMsg.msg.evt, rMsg.msg);
            });
        };
        this.broadcastUsers = function (nspName, msgs) {
            var _nsp = _this._nsps.get(nspName);
            if (_nsp === undefined) {
                logger_1.logger.error("could not get nsp by name: ", nspName);
                return;
            }
            msgs.forEach(function (uMsg) {
                _nsp.in(uMsg.userId.toString()).emit(uMsg.msg.evt, uMsg.msg);
            });
        };
        this.hdlGetAllNsps = function (req, resp) {
            var r = JSON.stringify(_this._nspConfiger.allNsp());
            resp.write(r);
            resp.end();
        };
        this.hdlGetNsp = function (req, resp) {
            var nspName = req.params.nspName;
            // logger.info(req.path)
            var nsps = _this._nspConfiger.allNsp().filter(function (cfg) {
                return nspName === cfg.name;
            });
            resp.write(JSON.stringify(nsps));
            resp.end();
        };
        logger_1.logger.info("socketio-wrapper initializing with opts: ", opt);
        this.port = opt.port || 3000;
        this._sm = new logic_1.SManagerBasedRedis(rc);
        this._nspConfiger = new NspConfiger();
        this._onoffEmitter = new logic_1.OnoffEmitterBasedRedis(rc);
        this._auth = new logic_1.DesTokenr();
        this._nsps = new Map();
        this._sockets = new Map();
        // create socketio server
        this._app = express_1.default();
        this._httpSrv = http_1.default.createServer(this._app);
        this._io = socket_io_1.default(this._httpSrv, {
            path: opt.path,
            transports: opt.transport ? opt.transport : undefined,
        });
        this._mountHandlers();
        this._mountNsps();
    }
    SocketioWrapper.prototype._authed = function (socketId) {
        return (this._sockets.get(socketId) !== undefined);
    };
    return SocketioWrapper;
}());
exports.SocketioWrapper = SocketioWrapper;
var NpsConfig = /** @class */ (function () {
    function NpsConfig(name, evts) {
        this.name = name;
        this.listenEvts = evts;
    }
    return NpsConfig;
}());
/**
 * Nsp Configer for socket.io server to  manage nsp configs
 * TODO: based mongodb or redis
 */
var NspConfiger = /** @class */ (function () {
    function NspConfiger() {
    }
    // TODO:
    NspConfiger.prototype.allNsp = function () {
        var nspCfgs = new Array();
        nspCfgs.push(new NpsConfig("demo", ["chat", "ban"]));
        return nspCfgs;
    };
    // TODO: apply new nsp, and nsp name should be only one
    NspConfiger.prototype.applyFor = function (cfg) {
    };
    NspConfiger.prototype.remove = function (nsp) {
    };
    NspConfiger.prototype._valid = function (nsp) {
        // TODO: valid nsp name, characters and existence
        return true;
    };
    return NspConfiger;
}());
