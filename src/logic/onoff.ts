import { IOnoff } from '../types'

enum EventType {
    On = "connect",
    Off = "disconnect",
}

interface EvtFunc {
    (data: IOnoff): Error | null
}
interface OnoffEmitter {
    on(data: IOnoff): Error | null
    off(data: IOnoff): Error | null
}

class OnoffEmitterBasedMQ implements OnoffEmitter {
    _mqConn: any

    constructor() {
        this._mqConn = null
    }

    off(data: IOnoff): Error | null {
        // TODO:
        throw new Error("Method not implemented.")
    }

    on(data: IOnoff): Error | null {
        // TODO:
        throw new Error("Method not implemented.")
    }
}

export { OnoffEmitter, OnoffEmitterBasedMQ, EventType }