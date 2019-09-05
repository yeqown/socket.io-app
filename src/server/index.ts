import { gRPCService, Options as gOptions } from './grpc'
import { SocketioWrapper, Options } from './socketio'

function initialSocketio(opt: Options): SocketioWrapper {
    // TODO: pass value into Socketio.Wrapper
    // let opt: Options = { port: 3000 }
    let s = new SocketioWrapper(opt)
    // open server
    // s.serve()
    return s
}

function initialRPC(opt: gOptions): gRPCService {
    // console.log("initialRPC service with opt:", opt);
    let s = new gRPCService(opt)
    return s
}

export { initialSocketio, initialRPC }