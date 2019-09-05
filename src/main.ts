import { initialSocketio, initialRPC } from './server'
import { Options, SocketioWrapper } from './server/socketio'
import { Options as gOptions, gRPCService } from './server/grpc'

function main() {
    let opt: Options = { port: 3000, path: "/socket.io" }
    let s: SocketioWrapper = initialSocketio(opt)
    s.serve()

    let opt2: gOptions = { port: 3001 }
    let s2: gRPCService = initialRPC(opt2)
    s2.serve()
}

main()