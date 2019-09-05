import { IAuthReq, AuthReply, IAuthReply } from '../types'

interface ITokenVerifier {
    verify(req: IAuthReq): IAuthReply
}

class DesTokenVerifier implements ITokenVerifier {
    constructor() {
        // TODO:
    }

    verify(req: IAuthReq): IAuthReply {
        let reply: IAuthReply = new AuthReply(0, "")
        return reply
    }
}

export { ITokenVerifier, DesTokenVerifier }