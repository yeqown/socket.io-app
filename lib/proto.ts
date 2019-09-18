import { v4 } from 'uuid'

interface IMessage {
    ver: Required<string>,
    meta: Required<string>,
    evt: Required<string>,
    id: Required<string>,
}

/**
 * 
 * @param ver 
 * @param meta 
 * @param evt 
 * @param id 
 */
function genMessage(evt: string, ver?: string, meta?: string, id?: string): IMessage {
    return {
        ver: ver || '1.0.0',
        meta: meta || '',
        evt: evt,
        id: id || v4(),
    }
}

interface IRoomsMessage {
    roomId: Required<string>,
    nspName: Required<string>
    msg: Required<IMessage>,
}

/**
 * 
 * @param nspName 
 * @param roomId 
 * @param msg 
 */
function genRoomsMessage(nspName: string, roomId: string, msg: IMessage): IRoomsMessage {
    return {
        nspName: nspName,
        roomId: roomId,
        msg: msg,
    }
}

interface IUsersMessage {
    nspName: Required<string>,
    userId: Required<number>,
    msg: Required<IMessage>,
}

/**
 * 
 * @param nspName 
 * @param userId 
 * @param msg 
 */
function genUsersMessage(nspName: string, userId: number, msg: IMessage): IUsersMessage {
    return {
        nspName: nspName,
        userId: userId,
        msg: msg,
    }
}



interface IKnockoutMeta {
    userId: number
    roomId: string
}


interface IAuthReq {
    token: string,
    userId: number,
    meta: object,
}


interface IAuthReply {
    errmsg: string,
    errcode: number,
}

export {
    IMessage, IRoomsMessage, IUsersMessage, IKnockoutMeta, IAuthReq, IAuthReply,
    genMessage, genRoomsMessage, genUsersMessage,
}