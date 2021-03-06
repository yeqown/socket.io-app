import { v4 } from 'uuid'
import {
    Message as pbMessage,
    RoomMessage as pbRoomMessage,
    UserMessage as pbUserMessage
} from '../codegen/api/api_pb'
// import { logger } from '../utils/logger'

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

/**
 * loadFromPbMessage load api_pb.Message into IMessage
 * @param pbm 
 */
function loadFromPbMessage(pbm?: pbMessage): IMessage {
    if (!pbm) {
        throw Error("invalid pb.Message, undefined")
    }

    return {
        meta: JSON.parse(pbm.getMeta()),
        ver: pbm.getVer(),
        evt: pbm.getEvt(),
        id: pbm.getId() || v4(),
    }
}

interface IRoomsMessage {
    roomId: Required<string>,
    nspName: Required<string>
    msg: Required<IMessage>,
}

/**
 * 
 * @param msg 
 * @param nspName 
 */
function loadFromPbRoomsMessage(msg: pbRoomMessage, nspName: string): IRoomsMessage {
    return {
        roomId: msg.getRoomid(),
        nspName: nspName,
        msg: loadFromPbMessage(msg.getMsg()),
    }
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
 * @param msg 
 * @param nspName 
 */
function loadFromPbUserMessage(msg: pbUserMessage, nspName: string): IUsersMessage {
    return {
        nspName: nspName,
        userId: msg.getUserid(),
        msg: loadFromPbMessage(msg.getMsg()),
    }
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

export {
    IMessage, IRoomsMessage, IUsersMessage, IKnockoutMeta,
    loadFromPbMessage, loadFromPbRoomsMessage, loadFromPbUserMessage,
    genMessage, genRoomsMessage, genUsersMessage,
}