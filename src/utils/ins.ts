// File global/ins.go
// Author: yeqown
// Date: 190905
// refer to https://github.com/NodeRedis/node_redis

// import bluebird from 'bluebird'
// import * as redis from 'redis'
import { RedisClient, createClient, ClientOpts } from 'redis'
import log4js, { Logger } from 'log4js'
import { MongoClient } from 'mongodb'
import { MongoOptions } from '../types/opts'
// import { Config } from '../utils/confs'
// import { promisify } from 'util'

// add promise to all redis-client functions
// bluebird.promisifyAll(RedisClient);

// let redisClient: RedisClient
// let mqClient: NSQClient

let redisClient: RedisClient
const initialRedis = (opt: ClientOpts) => {
    // let redisClientOpts: ClientOpts = {
    //     port: opt.port,
    //     host: opt.host,
    // }
    console.log("connecting to redis");
    try {
        redisClient = createClient(opt)
    } catch (err) {
        logger.error("could not create redis client", err)
        process.exit()
    }

    // const getAsync = promisify(redisClient.get).bind(redisClient)

    // redisClientAsync = {
    //     client: redisClient,
    //     getAsync: getAsync,
    // }
}
export {
    redisClient, initialRedis
}

let logger: log4js.Logger
const configureLogger = (conf: string): Logger | null => {
    let { NODE_ENV } = process.env
    try {
        log4js.configure(conf)
        if (NODE_ENV && NODE_ENV === 'dev') {
            logger = log4js.getLogger("dev")
        } else {
            logger = log4js.getLogger("prod")
        }
        return logger
    } catch (err) {
        console.log("could not configure logger: ", err);
        process.exit()
    }

    return null
}
export { logger, configureLogger }

let mgoClient: MongoClient
const initialMgo = async (opts: MongoOptions) => {
    console.log("connecting to mongo");
    let uri = "mongodb://" + opts.host + ":" + opts.port.toString()
    try {
        mgoClient = new MongoClient(uri, opts.mgoClientOpt)
        await mgoClient.connect().catch((err: Error) => {
            throw err
        })
    } catch (err) {
        console.log("could not connect to mongo: ", err)
        process.exit()
    }
}

export { mgoClient, initialMgo }
