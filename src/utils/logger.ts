import log4js, { Logger } from 'log4js'

export var logger: log4js.Logger

export const configureLogger = (conf: string): Logger | null => {
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