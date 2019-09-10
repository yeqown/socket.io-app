import { RedisClient } from "redis"
import { MongoClient, Db, MongoError, InsertOneWriteOpResult, WriteOpResult } from 'mongodb'
import { NspConfigOptions } from "../types"
import { logger } from "../utils/ins"
import { type } from "os"

export interface INspConfig {
    name: string
    listenEvts: string[]  // TODO: add more
}

export class NspConfig implements INspConfig {
    name: string
    listenEvts: string[]

    constructor(name: string, evts: string[]) {
        this.name = name
        this.listenEvts = evts
    }

    toObject(): INspConfig {
        let arr = this.listenEvts.map((v: string) => {
            return v
        })
        return {
            name: this.name,
            listenEvts: arr,
        }
    }
}

export interface INspConfiger {
    allNsp(callback: AllNspConfigCallback): void
    applyFor(cfg: INspConfig, callback: ApplyForCallback): void
    remove(nsp: string): void
}


export type AllNspConfigCallback = (err: Error | null, cfgs: INspConfig[]) => void
type ValidCallback = (err: Error | null, ex: boolean) => void
export type ApplyForCallback = (err: Error | null) => void
/**
 * Nsp Configer for socket.io server to  manage nsp configs
 * based mongodb or redis
 */
export class NspConfigRepo implements INspConfiger {
    _mgodb: Db
    _dbName: string
    _collName: string

    constructor(mgoC: MongoClient, opt: NspConfigOptions) {
        this._dbName = opt.db || "signaling-svc"
        this._collName = opt.coll || "nsp_configs"
        this._mgodb = mgoC.db(this._dbName)
    }

    /**
     * allNsp
     * get all nsp configs from database
     */
    allNsp(callback: AllNspConfigCallback) {
        let q = {}

        let nspCfgs = new Array<NspConfig>()
        nspCfgs.push(new NspConfig("/demo", ["chat", "ban"]))

        try {
            this._mgodb.collection(this._collName)
                .find(q)
                .toArray((err: MongoError, docs: NspConfig[]) => {
                    console.log("all nsp configs:", err, docs);
                    callback(err, docs)
                })
        } catch (err) {
            logger.error(__filename, 64, "get all nsp configs err: ", err)
            callback(err, [])
        }
    }

    /**
     * applyFor
     * @param cfg 
     * apply new nsp, and nsp name should be only one
     */
    applyFor(cfg: INspConfig, callback: ApplyForCallback) {
        // valid nspName
        this._valid(cfg.name, (err: Error | null, valid: boolean) => {
            if (err) {
                callback(err)
                return
            }

            if (!valid) {
                callback(new Error("nspName is in invalid format or exists"))
                return
            }
            // 
            // let doc = cfg
            try {
                this._mgodb.
                    collection(this._collName)
                    .insertOne(cfg, (err: MongoError, result: InsertOneWriteOpResult) => {
                        // logger.info(typeof cfg, typeof cfg.listenEvts, Array.isArray(cfg.listenEvts))
                        console.log(err, result.result)
                        if (err) {
                            logger.error(__filename, 79, "could not insert into mongodb:", err);
                            callback(err)
                            return
                        }
                        callback(null)
                        logger.info("insert an nsp config into DB successfully, with result: ", result.result)
                    })
            } catch (err) {
                callback(err)
                logger.error(__filename, 84, "could not insert into mongodb: ", err)
            }
        })

    }

    /**
     * 
     * @param nsp 
     */
    remove(nspName: string) {
        try {
            let q = { nspName }
            this._mgodb.collection(this._collName)
                .remove(q, (err: MongoError, result: WriteOpResult) => {
                    if (err) { logger.error(__filename, 96, "could not remove doc form mongodb:", err); return }
                    logger.info(__filename, "remove doc from mongodb successfully, result: ", result)
                })
        } catch (err) {
            logger.error(__filename, 101, "could not remove doc form mongodb:", err)
        }
    }

    /**
     * 
     * @param nsp 
     * valid nsp name, characters and existence
     */
    _valid(nspName: string, callback: ValidCallback): void {
        try {
            let q = { name: nspName } // INspConfig
            this._mgodb.collection(this._collName)
                .find(q)
                .count((err: MongoError, cnt: number) => {
                    if (err) {
                        logger.error(__filename, "valid nspName error: ", err)
                        callback(err, false)
                        return
                    }
                    callback(null, cnt == 0)
                })
        } catch (err) {
            logger.error(__filename, 124, "valid nspName error: ", err)
            callback(err, false)
        }
    }
}
