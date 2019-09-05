import { initialSocketio, initialRPC } from './server'
import { Options, SocketioWrapper } from './server/socketio'
import { Options as gOptions, gRPCService } from './server/grpc'
import { configureLogger, logger } from './utils/logger'
import path from 'path'
import yargs, { Argv } from 'yargs'


function main() {
    let argv = yargs
        .command("start", "running the server", (yargs: Argv) => {
            return yargs
                .option("log4jsConf", {
                    description: "log4js config filepath",
                    alias: 'lc',
                    default: "../confs/log4js.json"
                })
                .option("conf", {
                    description: "server running config filepath",
                    alias: "c",
                    default: "../confs/server.json",
                })
                .option("rpcPort", {
                    description: "rpc server listening on",
                    default: 3001
                })
                .option("socketioPort", {
                    description: "socket-io server listening on",
                    default: 3000
                })
        }, (argv) => {
            run(argv.log4jsConf)
        })
        .version("1.0.0")
        .help(true)
        .argv

    // console.log(argv)
    // if (argv.verbose) {
    //     console.log("version: 1.0.0");
    // }
}

const run = (log4jsConf: string) => {
    configureLogger(path.join(__dirname, log4jsConf))

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