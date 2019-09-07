import { codes, getMessage } from './codes'
// import { logger, configureLogger } from './logger'
// import { Logger } from 'log4js'
import { Config } from './confs'
import { Des, DesAlgorithm } from './des'
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
    Des, DesAlgorithm,
    codes, getMessage,
    // configureLogger, logger,
    Config,
    getNowTimestamp,
}
