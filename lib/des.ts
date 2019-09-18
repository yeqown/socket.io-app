import { createCipheriv, createDecipheriv, getCiphers } from 'crypto'
import * as proto from './proto'
import { codes, getMessage } from './codes'

enum DesAlgorithm {
    CBC = 'des-cbc',
    ECB = 'des-ecb',
}

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

class Des {
    _alg: string
    _key: string
    _iv: string
    // _cipher: Cipher
    // _decipher: Decipher

    constructor(alg: DesAlgorithm, key: string, iv: string) {
        let matched: string[] = getCiphers().filter(v => {
            // console.log(v);
            return v === alg
        })

        if (!matched.length) {
            throw Error("cipher not found")
        }

        this._alg = alg
        this._key = key.slice(0, 8)
        // this._iv = iv.slice(0, 16)
        this._iv = iv.length ? iv.slice(0, 8) : ''
        console.log(this._alg, this._key, this._iv);
    }

    /**
     * encrypt
     *  @param plainText
     */
    encrypt = (plainText: string): string => {
        let _cipher = createCipheriv(this._alg, this._key, this._iv) // cipher could not reuse
        _cipher.setAutoPadding(true) // default true
        let out = _cipher.update(plainText, 'utf8', 'base64')
        out += _cipher.final('base64');
        return out
        // this._cipher.update(plainText, 'utf8', 'base64') +
        //     this._cipher.final('base64')
    }

    /**
     * decrypt
     * @param encryptedText
     */
    decrypt = (encryptedText: string): string => {
        let _decipher = createDecipheriv(this._alg, this._key, this._iv) // decipher could not reuse
        _decipher.setAutoPadding(true) //default true
        return _decipher.update(encryptedText, 'base64', 'utf8') +
            _decipher.final('utf8');
    }
}


interface ITokenr {
    verify(req: proto.IAuthReq): proto.IAuthReply
    gen(userId: number, meta: any): proto.IAuthReq
}

class DesTokenr implements ITokenr {
    static alg = DesAlgorithm.CBC
    static key = "kV2CfasTWPmkHwfvoaE6eY"
    static iv = "3hjaueLWe+YUoiOhnnzo2Y"

    _des: Des

    constructor() {
        this._des = new Des(DesTokenr.alg, DesTokenr.key, DesTokenr.iv)
    }

    /**
     * 
     * @param userId 
     * @param meta 
     */
    gen(userId: number, meta: any): proto.IAuthReq {
        let tok = this._des.encrypt(JSON.stringify(meta))
        return {
            userId: userId,
            meta: meta,
            token: tok,
        }
    }

    /**
     * 
     * @param req 
     */
    verify(req: proto.IAuthReq): proto.IAuthReply {
        let encrypted = this._des.encrypt(JSON.stringify(req.meta))
        // let reply: IAuthReply
        if (req.token === encrypted) {
            return {
                errcode: codes.OK,
                errmsg: getMessage(codes.OK),
            }
        }

        return {
            errcode: codes.TokenInvalid,
            errmsg: getMessage(codes.TokenInvalid),
        }
    }
}

export { ITokenr, DesTokenr }