// File global/ins.go
// Author: yeqown
// Date: 190905
// refer to https://github.com/NodeRedis/node_redis

// import bluebird from 'bluebird'
// import * as redis from 'redis'
import { RedisClient, createClient, ClientOpts } from 'redis'
import { Config } from '../utils/confs'
import { promisify } from 'util'
import { IRedisClientAsync } from '../types'

// add promise to all redis-client functions
// bluebird.promisifyAll(RedisClient);

// let redisClient: RedisClient
// let mqClient: NSQClient

let redisClientAsync: IRedisClientAsync

export const initialRedis = (c: Config) => {
    // let redisClientOpts: ClientOpts = {
    //     port: opt.port,
    //     host: opt.host,
    // }
    let redisClient = createClient(c.redisOpts)

    const getAsync = promisify(redisClient.get).bind(redisClient)

    redisClientAsync = {
        client: redisClient,
        getAsync: getAsync,
    }
}




export { redisClientAsync }