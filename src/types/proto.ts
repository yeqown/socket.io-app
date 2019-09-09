import { v4 } from 'uuid'
import { Message as pbMessage } from '../codegen/api/api_pb'
// import { logger } from '../utils/logger'

interface IMessage {
    ver: Required<string>,
    meta: Required<string>,
    evt: Required<string>,
    id: Required<string>,
}

class Message implements IMessage {
    ver: string
    meta: any
    evt: string
    id: string

    constructor(meta?: any, ver: string = '1.0.0', id: string = '', evt: string = 'message') {
        this.ver = ver
        this.id = id || v4()
        this.evt = evt
        this.meta = meta
    }

    loadFromPb(pbm: pbMessage | undefined): IMessage {
        if (pbm === undefined) {
            console.log("meet an undefined api_pb.Message")
            return this
        }
        this.meta = JSON.parse(pbm.getMeta())
        this.ver = pbm.getVer()
        this.evt = pbm.getEvt()
        this.id = pbm.getId() || v4()
        return this
    }
}

interface IRoomsMessage {
    roomId: Required<string>,
    nspName: Required<string>
    msg: Required<IMessage>,
}

class RoomsMessage implements IRoomsMessage {
    roomId: Required<string>
    nspName: Required<string>
    msg: Required<IMessage>

    constructor(nspName: string, roomId: string, msg: IMessage) {
        this.nspName = nspName
        this.roomId = roomId
        this.msg = msg
    }
}

interface IUsersMessage {
    nspName: Required<string>,
    userId: Required<number>,
    msg: Required<IMessage>,
}

class UsersMessage implements IUsersMessage {
    nspName: string
    userId: number
    msg: IMessage

    constructor(nspName: string, userId: number, msg: IMessage) {
        this.nspName = nspName
        this.userId = userId
        this.msg = msg
    }
}

export {
    IMessage, IRoomsMessage, IUsersMessage,
    Message, RoomsMessage, UsersMessage
}