import path from 'path'
import yargs, { Argv } from 'yargs'

import { initialSocketio, initialRPC, gRPCService, SocketioWrapper } from './server'
import { Config } from './utils'
import { initialRedis, configureLogger, logger, initialMgo } from './utils/ins'
// import { promisify } from 'util'
// import { Logger } from 'log4js'
// import { GrpcServerOptions, SocketioOptions } from './types'


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


const run = async (log4jsConf: string, conf: Required<string>) => {
    // Step: config logger
    configureLogger(path.join(__dirname, log4jsConf))
    // const configureLoggerAsync = promisify<string, Logger | null>(configureLogger)
    // configureLoggerAsync(path.join(__dirname, log4jsConf)).then(l => {
    // })

    // Step: load config
    let cfg: Config = new Config(path.join(__dirname, conf))

    // Step: load redis
    initialRedis(cfg.redisOpts)

    // Step: load mongo
    await initialMgo(cfg.mgoOpts)

    // Step: socketio server
    // let opt: Options = cfg.
    let s: SocketioWrapper = initialSocketio(cfg.socketioOpts)
    s.serve()

    // Step: gRPC server
    // let opt2: gOptions = { port: 3001 }
    let s2: gRPCService = initialRPC(cfg.grpcOpts, s)
    s2.serve()
}

main()

// recovery for nodejs
process.on("uncaughtException", (err) => {
    logger.error("process error: ", err);
})