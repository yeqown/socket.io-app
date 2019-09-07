"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var DesAlgorithm;
(function (DesAlgorithm) {
    DesAlgorithm["CBC"] = "des-cbc";
    DesAlgorithm["ECB"] = "des-ecb";
})(DesAlgorithm || (DesAlgorithm = {}));
exports.DesAlgorithm = DesAlgorithm;
// DES-ECB -      Key: 8;  IV: 0
// DES-CBC -      Key: 8;  IV: 8
// DES-CFB -      Key: 8;  IV: 8
// DES-CFB1 -     Key: 8;  IV: 8
// DES-CFB8 -     Key: 8;  IV: 8
// DES-EDE-CBC -  Key: 16; IV: 8
// DES-EDE-CFB -  Key: 16; IV: 8
// DES-EDE-OFB -  Key: 16; IV: 8
// DES-EDE3-CBC - Key: 24; IV: 8
// DESX-CBC -     Key: 24; IV: 8
var Des = /** @class */ (function () {
    // _cipher: Cipher
    // _decipher: Decipher
    function Des(alg, key, iv) {
        var _this = this;
        /*
            encrypt 加密明文生成秘文
            @param plainText 明文
        */
        this.encrypt = function (plainText) {
            var _cipher = crypto_1.createCipheriv(_this._alg, _this._key, _this._iv); // cipher
            _cipher.setAutoPadding(true); // default true
            var out = _cipher.update(plainText, 'utf8', 'base64');
            out += _cipher.final('base64');
            return out;
            // this._cipher.update(plainText, 'utf8', 'base64') +
            //     this._cipher.final('base64')
        };
        this.decrypt = function (encryptedText) {
            var _decipher = crypto_1.createDecipheriv(_this._alg, _this._key, _this._iv); // decipher
            _decipher.setAutoPadding(true); //default true
            return _decipher.update(encryptedText, 'base64', 'utf8') +
                _decipher.final('utf8');
        };
        var matched = crypto_1.getCiphers().filter(function (v) {
            // console.log(v);
            return v === alg;
        });
        if (!matched.length) {
            throw Error("cipher not found");
        }
        this._alg = alg;
        this._key = key.slice(0, 8);
        // this._iv = iv.slice(0, 16)
        this._iv = iv.length ? iv.slice(0, 8) : '';
        console.log(this._alg, this._key, this._iv);
    }
    return Des;
}());
exports.Des = Des;
