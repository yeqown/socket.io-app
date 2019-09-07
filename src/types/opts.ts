
export interface SocketioOptions {
    port: Required<number>,
    path: Required<string>,
    transport?: string[],
}

export interface GrpcServerOptions {
    port: number
}