import log4js from 'log4js'

export let logger: log4js.Logger

export const configureLogger = (conf: string) => {
    let { NODE_ENV } = process.env
    log4js.configure(conf)

    if (NODE_ENV && NODE_ENV === 'dev') {
        logger = log4js.getLogger("default")
    } else {
        logger = log4js.getLogger("file")
    }
}