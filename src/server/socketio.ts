// import io from 'socket.io'
// import { proto } from "@/types"

interface Options {
    port: number,
    path: string,
    transport?: string[],
}

class SocketioWrapper {
    /*
        to manage callers' nsp and serving on port
    */
    port: number

    constructor(opt: Options) {
        console.log("socketio-wrapper initializing");
        this.port = opt.port || 3000
    }

    /* 
        open socket.io server 
    */
    serve = () => {
    }

    broadcast = () => {

    }

    broadcastRooms = () => {

    }

    broadcastUsers = (req: any) => {

    }
}

export { SocketioWrapper, Options }