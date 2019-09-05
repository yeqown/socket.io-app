import { ClientOpts } from 'redis'

class Config {
    redisOpts: ClientOpts

    constructor() {
        this.redisOpts = { port: 6379, host: "127.0.0.1" }
    }

    load(path: string) {
        // this.redisOpts =
    }
}

export { Config }