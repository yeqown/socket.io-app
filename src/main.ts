import path from 'path'
import yargs, { Argv } from 'yargs'

import { initialSocketio, initialRPC } from './server'
import { Options, SocketioWrapper } from './server/socketio'
import { Options as gOptions, gRPCService } from './server/grpc'
import { configureLogger, logger } from './utils/logger'
import { initialRedis, redisClientAsync } from './global'
import { Config } from './utils/confs'


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
            run(argv.log4jsConf, argv.conf)
        })
        .version("1.0.0")
        .help(true)
        .argv

    // ignore this value
    // console.log(argv);
    argv
}

const run = (log4jsConf: string, conf: Required<string>) => {
    // Step: config logger
    configureLogger(path.join(__dirname, log4jsConf))

    // Step: load config
    let cfg: Config = new Config(path.join(__dirname, conf))

    // Step: load redis
    initialRedis(cfg)

    // TODO: Step: load mongo
    // initialMongo(cfg)

    // Step: socketio server
    let opt: Options = { port: 3000, path: "/socket.io" }
    let s: SocketioWrapper = initialSocketio(opt, redisClientAsync)
    s.serve()

    // Step: gRPC server
    let opt2: gOptions = { port: 3001 }
    let s2: gRPCService = initialRPC(opt2)
    s2.serve()
}

main()

// recovery for nodejs
process.on("uncaughtException", (err) => {
    logger.error(err);
})