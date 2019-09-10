import { MongoClientOptions } from "mongodb";

export interface SocketioOptions {
    port: Required<number>,
    path: Required<string>,
    transport?: string[],
    nspConfigOpt: NspConfigOptions
}

export interface GrpcServerOptions {
    port: number
}

export interface NspConfigOptions {
    db: string
    coll: string
}

export interface MongoOptions {
    host: string
    port: number
    mgoClientOpt: MongoClientOptions
}