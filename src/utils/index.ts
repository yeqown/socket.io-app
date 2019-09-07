import * as des from './des'
import { codes, getMessage } from './codes'
// import { logger, configureLogger } from './logger'
// import { Logger } from 'log4js'
import { Config } from './confs'
/**
 * getNowTimestamp get timestamp (ms)
 */
const getNowTimestamp = (): number => {
    return new Date().getTime()
}

// const setLogger = (logger: Logger) => {
//     logger = logger
// }

export {
    des,
    codes, getMessage,
    // configureLogger, logger,
    Config,
    getNowTimestamp
}
