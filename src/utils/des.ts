import { createCipheriv, createDecipheriv, getCiphers } from 'crypto'

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
    /*
        encrypt 加密明文生成秘文
        @param plainText 明文
    */
    encrypt = (plainText: string): string => {
        let _cipher = createCipheriv(this._alg, this._key, this._iv) // cipher
        _cipher.setAutoPadding(true) // default true
        let out = _cipher.update(plainText, 'utf8', 'base64')
        out += _cipher.final('base64');
        return out
        // this._cipher.update(plainText, 'utf8', 'base64') +
        //     this._cipher.final('base64')
    }

    decrypt = (encryptedText: string): string => {
        let _decipher = createDecipheriv(this._alg, this._key, this._iv) // decipher
        _decipher.setAutoPadding(true) //default true
        return _decipher.update(encryptedText, 'base64', 'utf8') +
            _decipher.final('utf8');
    }
}

export {
    Des, DesAlgorithm
}