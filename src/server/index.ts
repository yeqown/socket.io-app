import { gRPCService } from './grpc'
import { SocketioWrapper } from './app'
// import { IRedisClientAsync } from 'src/types'
import { ClientOpts } from 'redis'
import { GrpcServerOptions, SocketioOptions } from '../types'

function initialSocketio(opt: SocketioOptions, redisOpts: ClientOpts): SocketioWrapper {
    // let opt: Options = { port: 3000 }
    let s = new SocketioWrapper(opt, redisOpts)
    // open server
    // s.serve()
    return s
}

function initialRPC(opt: GrpcServerOptions, srv: SocketioWrapper, redisOpts: ClientOpts): gRPCService {
    // console.log("initialRPC service with opt:", opt);
    let s = new gRPCService(opt, srv, redisOpts)
    return s
}

export { initialSocketio, initialRPC, gRPCService, SocketioWrapper }