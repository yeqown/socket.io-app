import { v4 } from 'uuid'
import { Message as pbMessage } from '../codegen/api/api_pb'
import { logger } from '../utils/logger'

interface IMessage {
    ver: Required<string>,
    meta: Required<string>,
    evt: Required<string>,
    id: Required<string>,
}

class Message implements IMessage {
    ver: string
    meta: string
    evt: string
    id: string

    constructor(meta?: any, ver: string = '1.0.0', id: string = '', evt: string = 'message') {
        this.ver = ver
        this.id = id || v4()
        this.evt = evt
        this.meta = JSON.stringify(meta)
    }

    loadFromPb(pbm: pbMessage | undefined): IMessage {
        if (pbm === undefined) {
            logger.error("meet an undefined api_pb.Message")
            return this
        }
        this.meta = pbm.getMeta()
        this.ver = pbm.getVer()
        this.evt = pbm.getEvt()
        this.id = pbm.getId() || v4()
        return this
    }
}

interface IRoomsMessage {
    roomId: Required<string>,
    msg: Required<IMessage>,
}

class RoomsMessage implements IRoomsMessage {
    roomId: Required<string>
    msg: Required<IMessage>

    constructor(roomId: string, msg: IMessage) {
        this.roomId = roomId
        this.msg = msg
    }
}

interface IUsersMessage {
    userId: Required<number>,
    msg: Required<IMessage>,
}

class UsersMessage implements IUsersMessage {
    userId: number
    msg: IMessage

    constructor(userId: Required<number>, msg: Required<IMessage>) {
        this.userId = userId
        this.msg = msg
    }
}

export {
    IMessage, IRoomsMessage, IUsersMessage,
    Message, RoomsMessage, UsersMessage
}