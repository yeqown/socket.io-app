import { IAuthReq, AuthReply, IAuthReply, AuthReq } from '../types'
import { Des, DesAlgorithm, codes, getMessage } from '../utils'

interface ITokenr {
    verify(req: IAuthReq): IAuthReply
    gen(userId: number, meta: any): IAuthReq
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
    gen(userId: number, meta: any): IAuthReq {
        let tok = this._des.encrypt(JSON.stringify(meta))
        return new AuthReq(userId, tok, meta)
    }

    /**
     * 
     * @param req 
     */
    verify(req: IAuthReq): IAuthReply {
        let encrypted = this._des.encrypt(JSON.stringify(req.meta))
        // let reply: IAuthReply
        if (req.token === encrypted) {
            return new AuthReply(codes.OK, getMessage(codes.OK))
        }

        return new AuthReply(codes.TokenInvalid, getMessage(codes.TokenInvalid))
    }
}

export { ITokenr, DesTokenr }