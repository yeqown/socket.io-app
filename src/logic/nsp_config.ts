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
    allNsp(): Promise<INspConfig[]>
    applyFor(cfg: INspConfig): Promise<boolean>
    remove(nsp: string): void
}


// export type AllNspConfigCallback = (err: Error | null, cfgs: INspConfig[]) => void
// type ValidCallback = (err: Error | null, ex: boolean) => void
// export type ApplyForCallback = (err: Error | null) => void
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
    async allNsp(): Promise<INspConfig[]> {
        let q = {}
        let docs = await this._mgodb.collection(this._collName)
            .find<INspConfig>(q).toArray()

        return docs
    }

    /**
     * applyFor
     * @param cfg 
     * apply new nsp, and nsp name should be only one
     */
    async applyFor(cfg: INspConfig): Promise<boolean> {
        try {
            await this._valid(cfg.name)
            let result = await this._mgodb.collection(this._collName)
                .insertOne(cfg)
            logger.info("insert an nsp config into DB successfully, with result: ", result.result)
            return true
        } catch (error) {
            logger.error("could not insert into mongodb: ", error)
            throw error
        }
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
    async _valid(nspName: string): Promise<boolean> {
        let q = { name: nspName } // INspConfig
        let cnt = await this._mgodb.collection(this._collName)
            .find(q)
            .count()
        if (cnt === 0) {
            // true: nspName not found
            return true
        }

        logger.error("nspName has exists")
        throw new Error("invalid nspName format")
    }
}
