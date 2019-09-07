import { ClientOpts } from 'redis'
import { readFileSync } from 'fs'
import { logger } from './logger'
import { SocketioOptions, GrpcServerOptions } from '../types'

class Config {
    redisOpts: ClientOpts
    mgoOpts: any
    socketioOpts: SocketioOptions
    grpcOpts: GrpcServerOptions

    constructor(confPath: string) {
        let buf: Buffer
        try {
            buf = readFileSync(confPath)
        } catch (err) {
            logger.error("could not readfile sync: ", confPath, "err: ", err)
            throw err
        }
        let r = JSON.parse(buf.toString())
        let { redis, mongo, socketio, grpc } = r

        this.redisOpts = redis || { port: 6379, host: "127.0.0.1" }
        this.mgoOpts = mongo || {}
        this.socketioOpts = socketio || {}
        this.grpcOpts = grpc || {}

        logger.info("mgo config: ", this.mgoOpts)
        logger.info("redis config: ", this.redisOpts)
    }
}

export { Config }