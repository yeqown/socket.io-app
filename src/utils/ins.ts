// File global/ins.go
// Author: yeqown
// Date: 190905
// refer to https://github.com/NodeRedis/node_redis

// import bluebird from 'bluebird'
// import * as redis from 'redis'
import { RedisClient, createClient, ClientOpts } from 'redis'
import log4js, { Logger } from 'log4js'
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
    try {
        redisClient = createClient(opt)
    } catch (err) {
        logger.error("could not create redis client", err)
    }

    // const getAsync = promisify(redisClient.get).bind(redisClient)

    // redisClientAsync = {
    //     client: redisClient,
    //     getAsync: getAsync,
    // }
}


let logger: log4js.Logger

const configureLogger = (conf: string): Logger | null => {
    let { NODE_ENV } = process.env

    try {
        log4js.configure(conf)
        if (NODE_ENV && NODE_ENV === 'dev') {
            logger = log4js.getLogger("default")
        } else {
            logger = log4js.getLogger("file")
        }
        return logger
    } catch (err) {
        console.log("could not configure logger: ", err);
    }

    return null
}

export { redisClient, initialRedis, logger, configureLogger }