import { getNowTimestamp } from "../utils"

/**
 * monitor
 */
interface INspStat {
    name: string
    createdAt: number // create timestamp
    roomCnt: number
    socketCnt: number
}

interface IRoomStat {
    nspName: string
    name: string
    createdAt: number // create timestamp
    socketCnt: number
}

interface IMonitor {
    getNspCount(): number
    getNspStat(nspName: string): INspStat
}

class MonitorBasedRedis implements IMonitor {
    /**
     * MonitorBasedRedis all data saved into redis
     */

    /**
     * getNspCount
     * TODO:
     */
    getNspCount(): number {
        return 0
    }

    /**
     * getNspStat
     * @param nspName 
     * TODO:
     */
    getNspStat(nspName: string): INspStat {
        return {
            name: nspName,
            createdAt: getNowTimestamp(),
            roomCnt: 0,
            socketCnt: 0,
        }
    }

    /**
     * getRoomStat
     * @param nspName 
     * @param roomId 
     * TODO:
     */
    getRoomStat(nspName: string, roomId: string): IRoomStat {
        return {
            nspName: nspName,
            name: roomId,
            createdAt: getNowTimestamp(),
            socketCnt: 0,
        }
    }
}