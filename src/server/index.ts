import { gRPCService } from './grpc'
import { SocketioWrapper } from './socketio'
// import { IRedisClientAsync } from 'src/types'
import { RedisClient } from 'redis'
import { GrpcServerOptions, SocketioOptions } from '../types'

function initialSocketio(opt: SocketioOptions, rc: RedisClient): SocketioWrapper {
    // let opt: Options = { port: 3000 }
    let s = new SocketioWrapper(opt, rc)
    // open server
    // s.serve()
    return s
}

function initialRPC(opt: GrpcServerOptions, srv: SocketioWrapper): gRPCService {
    // console.log("initialRPC service with opt:", opt);
    let s = new gRPCService(opt, srv)
    return s
}

export { initialSocketio, initialRPC, gRPCService, SocketioWrapper }