// File global/ins.go
// Author: yeqown
// Date: 190905
// refer to https://github.com/NodeRedis/node_redis

// import bluebird from 'bluebird'
// import * as redis from 'redis'
import { RedisClient, createClient, ClientOpts } from 'redis'
import { logger } from '../utils/logger'
// import { Config } from '../utils/confs'
// import { promisify } from 'util'

// add promise to all redis-client functions
// bluebird.promisifyAll(RedisClient);

// let redisClient: RedisClient
// let mqClient: NSQClient

let redisClient: RedisClient

export const initialRedis = (opt: ClientOpts) => {
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

export { redisClient }