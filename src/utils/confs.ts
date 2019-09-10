import { ClientOpts } from 'redis'
import { readFileSync } from 'fs'
import { logger } from '../utils/ins'
import { SocketioOptions, GrpcServerOptions, MongoOptions } from '../types'

class Config {
    redisOpts: ClientOpts
    mgoOpts: MongoOptions // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
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
        this.mgoOpts = mongo || { host: "127.0.0.1", port: 27017, opt: null }
        this.socketioOpts = socketio || {}
        this.grpcOpts = grpc || {}

        logger.info("mgo config: ", this.mgoOpts)
        logger.info("redis config: ", this.redisOpts)
    }
}

export { Config }