import { v4 } from 'uuid'

interface IMessage {
    ver: Required<string>,
    meta: Required<object>,
    evt: Required<string>,
    id: Required<string>,
}


class Message implements IMessage {
    ver: string
    meta: object
    evt: string
    id: string

    constructor(meta: object, ver: string = '1.0.0', id: string = '', evt: string = 'message') {
        this.ver = ver
        this.id = id || v4()
        this.evt = evt
        this.meta = meta
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