// https://grpc.io/docs/tutorials/basic/node/

// const _protoPath = "."
// import grpc from 'grpc'
// import protoLoader from '@grpc/proto-loader'

// /**
//  * init load proto files
//  */
// const packageDefinition = protoLoader.loadSync(
//     _protoPath,
//     {
//         keepCase: true,
//         longs: String,
//         enums: String,
//         defaults: true,
//         oneofs: true
//     }
// );

// /**
//  * dynamic load grpc.GrpcObject
//  */
// export function dynamicLoad(): grpc.GrpcObject {
//     let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
//     // The protoDescriptor object has the full package hierarchy
//     // let routeguide = protoDescriptor.routeguide;
//     console.log(protoDescriptor)
//     return protoDescriptor
// }

