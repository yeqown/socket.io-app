import { gRPCService, Options as gOptions } from './grpc'
import { SocketioWrapper, Options } from './socketio'
import { IRedisClientAsync } from 'src/types'

function initialSocketio(opt: Options, rc: IRedisClientAsync): SocketioWrapper {
    // TODO: pass value into Socketio.Wrapper
    // let opt: Options = { port: 3000 }
    let s = new SocketioWrapper(opt, rc)
    // open server
    // s.serve()
    return s
}

function initialRPC(opt: gOptions, srv: SocketioWrapper): gRPCService {
    // console.log("initialRPC service with opt:", opt);
    let s = new gRPCService(opt, srv)
    return s
}

export { initialSocketio, initialRPC }