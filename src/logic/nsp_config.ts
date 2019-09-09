import { RedisClient } from "redis"

export interface INspConfig {
    name: string
    listenEvts: string[]
    // TODO: add more
}

export class NspConfig implements INspConfig {
    name: Required<string>
    listenEvts: Required<string[]>

    constructor(name: Required<string>, evts: Required<string[]>) {
        this.name = name
        this.listenEvts = evts
    }
}

export interface INspConfiger {
    allNsp(): INspConfig[]
    applyFor(cfg: INspConfig): void
    remove(nsp: string): void
}

/**
 * Nsp Configer for socket.io server to  manage nsp configs
 * TODO: based mongodb or redis
 */
export class NspConfigRepo implements INspConfiger {
    rc: RedisClient

    constructor(rc: RedisClient) {
        this.rc = rc
    }

    static _genQueueName(): string {
        return "nsp#configs"
    }

    /**
     * allNsp
     * TODO:
     */
    allNsp(): INspConfig[] {
        let nspCfgs = new Array<NspConfig>()
        nspCfgs.push(new NspConfig("/demo", ["chat", "ban"]))
        return nspCfgs
    }

    /**
     * 
     * @param cfg 
     *  TODO: apply new nsp, and nsp name should be only one
     */
    applyFor(cfg: INspConfig) {

    }

    /**
     * 
     * @param nsp 
     */
    remove(nsp: string) {

    }

    /**
     * 
     * @param nsp 
     */
    _valid(nsp: string): boolean {
        // TODO: valid nsp name, characters and existence
        return true
    }
}
