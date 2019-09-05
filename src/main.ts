import { initialSocketio, initialRPC } from './server'
import { Options, SocketioWrapper } from './server/socketio'
import { Options as gOptions, gRPCService } from './server/grpc'
import { configureLogger, logger } from './utils/logger'
import path from 'path'

function main() {

    configureLogger(path.join(__dirname, "../confs/log4js.json"))

    let opt: Options = { port: 3000, path: "/socket.io" }
    let s: SocketioWrapper = initialSocketio(opt)
    s.serve()

    let opt2: gOptions = { port: 3001 }
    let s2: gRPCService = initialRPC(opt2)
    s2.serve()
}

main()

// recovery for nodejs
process.on("uncaughtException", (err) => {
    logger.error(err);
})