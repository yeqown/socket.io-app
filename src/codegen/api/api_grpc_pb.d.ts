// package: api
// file: api.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as api_pb from "./api_pb";

interface ISocketMServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    nspBroadcast: ISocketMServiceService_INspBroadcast;
    nspRoomsBroadcast: ISocketMServiceService_INspRoomsBroadcast;
    nspUsersBroadcast: ISocketMServiceService_INspUsersBroadcast;
    deactive: ISocketMServiceService_IDeactive;
    clearRoom: ISocketMServiceService_IClearRoom;
}

interface ISocketMServiceService_INspBroadcast extends grpc.MethodDefinition<api_pb.NspBroadcastReq, api_pb.NspBroadcastResp> {
    path: string; // "/api.SocketMService/NspBroadcast"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.NspBroadcastReq>;
    requestDeserialize: grpc.deserialize<api_pb.NspBroadcastReq>;
    responseSerialize: grpc.serialize<api_pb.NspBroadcastResp>;
    responseDeserialize: grpc.deserialize<api_pb.NspBroadcastResp>;
}
interface ISocketMServiceService_INspRoomsBroadcast extends grpc.MethodDefinition<api_pb.NspRoomsBroadcastReq, api_pb.NspRoomsBroadcastResp> {
    path: string; // "/api.SocketMService/NspRoomsBroadcast"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.NspRoomsBroadcastReq>;
    requestDeserialize: grpc.deserialize<api_pb.NspRoomsBroadcastReq>;
    responseSerialize: grpc.serialize<api_pb.NspRoomsBroadcastResp>;
    responseDeserialize: grpc.deserialize<api_pb.NspRoomsBroadcastResp>;
}
interface ISocketMServiceService_INspUsersBroadcast extends grpc.MethodDefinition<api_pb.NspUsersBroadcastReq, api_pb.NspUsersBroadcastResp> {
    path: string; // "/api.SocketMService/NspUsersBroadcast"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.NspUsersBroadcastReq>;
    requestDeserialize: grpc.deserialize<api_pb.NspUsersBroadcastReq>;
    responseSerialize: grpc.serialize<api_pb.NspUsersBroadcastResp>;
    responseDeserialize: grpc.deserialize<api_pb.NspUsersBroadcastResp>;
}
interface ISocketMServiceService_IDeactive extends grpc.MethodDefinition<api_pb.DeactiveReq, api_pb.DeactiveResp> {
    path: string; // "/api.SocketMService/Deactive"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.DeactiveReq>;
    requestDeserialize: grpc.deserialize<api_pb.DeactiveReq>;
    responseSerialize: grpc.serialize<api_pb.DeactiveResp>;
    responseDeserialize: grpc.deserialize<api_pb.DeactiveResp>;
}
interface ISocketMServiceService_IClearRoom extends grpc.MethodDefinition<api_pb.ClearRoomReq, api_pb.ClearRoomResp> {
    path: string; // "/api.SocketMService/ClearRoom"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.ClearRoomReq>;
    requestDeserialize: grpc.deserialize<api_pb.ClearRoomReq>;
    responseSerialize: grpc.serialize<api_pb.ClearRoomResp>;
    responseDeserialize: grpc.deserialize<api_pb.ClearRoomResp>;
}

export const SocketMServiceService: ISocketMServiceService;

export interface ISocketMServiceServer {
    nspBroadcast: grpc.handleUnaryCall<api_pb.NspBroadcastReq, api_pb.NspBroadcastResp>;
    nspRoomsBroadcast: grpc.handleUnaryCall<api_pb.NspRoomsBroadcastReq, api_pb.NspRoomsBroadcastResp>;
    nspUsersBroadcast: grpc.handleUnaryCall<api_pb.NspUsersBroadcastReq, api_pb.NspUsersBroadcastResp>;
    deactive: grpc.handleUnaryCall<api_pb.DeactiveReq, api_pb.DeactiveResp>;
    clearRoom: grpc.handleUnaryCall<api_pb.ClearRoomReq, api_pb.ClearRoomResp>;
}

export interface ISocketMServiceClient {
    nspBroadcast(request: api_pb.NspBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    nspBroadcast(request: api_pb.NspBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    nspBroadcast(request: api_pb.NspBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    deactive(request: api_pb.DeactiveReq, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    deactive(request: api_pb.DeactiveReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    deactive(request: api_pb.DeactiveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    clearRoom(request: api_pb.ClearRoomReq, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
    clearRoom(request: api_pb.ClearRoomReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
    clearRoom(request: api_pb.ClearRoomReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
}

export class SocketMServiceClient extends grpc.Client implements ISocketMServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public nspBroadcast(request: api_pb.NspBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspBroadcast(request: api_pb.NspBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspBroadcast(request: api_pb.NspBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspRoomsBroadcast(request: api_pb.NspRoomsBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspRoomsBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    public nspUsersBroadcast(request: api_pb.NspUsersBroadcastReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.NspUsersBroadcastResp) => void): grpc.ClientUnaryCall;
    public deactive(request: api_pb.DeactiveReq, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    public deactive(request: api_pb.DeactiveReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    public deactive(request: api_pb.DeactiveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.DeactiveResp) => void): grpc.ClientUnaryCall;
    public clearRoom(request: api_pb.ClearRoomReq, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
    public clearRoom(request: api_pb.ClearRoomReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
    public clearRoom(request: api_pb.ClearRoomReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomResp) => void): grpc.ClientUnaryCall;
}
