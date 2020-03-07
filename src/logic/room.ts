import io from 'socket.io'
import { logger } from '../utils/ins'
import { proto } from '../types'

/**
 * room.ts
 */

interface IRoom {
    Id: string
    leave(userId: number): void
    join(userId: number, sock: io.Socket): void
    userIdsArr(): number[]
    broadcast(evt: string, message: proto.IMessage): void
    isEmpty(): boolean
    statics(): Object
}

interface ackFunc {
    (messageId: string, userId: number): void
}

class RoomWithAck {
    Id: string
    userIds: Array<number>
    _sockets: Map<number, io.Socket>
    _olClientCnt: number
    _historyMsgCnt: number

    // _messageAcker: Map<string, messageAcker>

    constructor(id: string) {
        this.Id = id
        this.userIds = new Array<number>()
        this._sockets = new Map<number, io.Socket>()
        this._olClientCnt = 0
        this._historyMsgCnt = 0
        // this._messageAcker = new Map<string, messageAcker>()
    }

    // 获取当前房间的在线人数
    isEmpty(): boolean {
        return (this._olClientCnt === 0)
    }

    join(userId: number, sock: io.Socket): void {
        if (this._sockets.has(userId)) {
            this._sockets.set(userId, sock)
            return
        }

        this._sockets.set(userId, sock)
        this.userIds.push(userId)

        this._olClientCnt++
    }

    /**
     * leave .
     * @param userId 
     */
    leave(userId: number) {
        if (this._sockets.has(userId)) {
            // true: 用户在当前房间
            let idx = this.userIds.indexOf(userId)
            if (idx < 0) {
                // true: not found
                return
            }
            this.userIds.splice(idx, 1)
            this._sockets.delete(userId)
            this._olClientCnt--
        }
    }

    userIdsArr(): number[] {
        return this.userIds
    }

    broadcast(evt: string, message: proto.IMessage): void {
        logger.info("RoomWithAck.broadcast evt=%s, message=", evt, message)
        this._historyMsgCnt++
        let ackUserIdset = new Set<number>(this.userIds)
        const ackFunc = (messageId: string, userId: number) => {
            logger.debug(messageId, userId, "acked......", ackUserIdset.delete(userId))
        }

        /**
         * 
         * @param timeout 单位s
         */
        const genTimeoutHdl = (timeout: number) => {
            setTimeout(() => {
                if (!ackUserIdset.size) {
                    // true: all clients acked
                    logger.debug("RoomWithAck.broadcast has no userId to retry in 3000ms")

                    return
                }
                this.actualEmit(ackUserIdset.keys(), evt, message, ackFunc)

                timeout += 5
                if (timeout <= 25) {
                    // true: total delay is less than 2min
                    genTimeoutHdl(timeout)
                }

            }, timeout * 1000)
        }

        this.actualEmit(ackUserIdset.keys(), evt, message, ackFunc)
        genTimeoutHdl(5)
    }

    private actualEmit(userIds: IterableIterator<number>, evt: string, message: proto.IMessage, fn: ackFunc) {
        let it: IteratorResult<number, any>
        while (it = userIds.next(), !it.done) {
            logger.debug("RoomWithAck.actualEmit iterator an userId=%d to emit", it.value)
            let _socket = this._sockets.get(it.value)
            if (_socket) {
                // true: got socket then emit message with callback
                _socket.emit(evt, message, fn)
            }
        }
    }

    statics(): Object {
        return {
            id: this.Id,
            userIdsCnt: this.userIds.length,
            _socketsCnt: this._sockets.size,
            _olClientCnt: this._olClientCnt,
        }
    }
}

export { IRoom, RoomWithAck }
