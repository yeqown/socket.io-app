// package: api
// file: api.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as api_pb from "./api_pb";

interface ISocketMServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    nspBroadcast: ISocketMServiceService_INspBroadcast;
    nspRoomsBroadcast: ISocketMServiceService_INspRoomsBroadcast;
    nspUsersBroadcast: ISocketMServiceService_INspUsersBroadcast;
    disconnect: ISocketMServiceService_IDisconnect;
    knockoutFromRoom: ISocketMServiceService_IKnockoutFromRoom;
    clearRooms: ISocketMServiceService_IClearRooms;
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
interface ISocketMServiceService_IDisconnect extends grpc.MethodDefinition<api_pb.DisconnectReq, api_pb.DisconnectResp> {
    path: string; // "/api.SocketMService/Disconnect"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.DisconnectReq>;
    requestDeserialize: grpc.deserialize<api_pb.DisconnectReq>;
    responseSerialize: grpc.serialize<api_pb.DisconnectResp>;
    responseDeserialize: grpc.deserialize<api_pb.DisconnectResp>;
}
interface ISocketMServiceService_IKnockoutFromRoom extends grpc.MethodDefinition<api_pb.KnockoutReq, api_pb.KnockoutResp> {
    path: string; // "/api.SocketMService/KnockoutFromRoom"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.KnockoutReq>;
    requestDeserialize: grpc.deserialize<api_pb.KnockoutReq>;
    responseSerialize: grpc.serialize<api_pb.KnockoutResp>;
    responseDeserialize: grpc.deserialize<api_pb.KnockoutResp>;
}
interface ISocketMServiceService_IClearRooms extends grpc.MethodDefinition<api_pb.ClearRoomsReq, api_pb.ClearRoomsResp> {
    path: string; // "/api.SocketMService/ClearRooms"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.ClearRoomsReq>;
    requestDeserialize: grpc.deserialize<api_pb.ClearRoomsReq>;
    responseSerialize: grpc.serialize<api_pb.ClearRoomsResp>;
    responseDeserialize: grpc.deserialize<api_pb.ClearRoomsResp>;
}

export const SocketMServiceService: ISocketMServiceService;

export interface ISocketMServiceServer {
    nspBroadcast: grpc.handleUnaryCall<api_pb.NspBroadcastReq, api_pb.NspBroadcastResp>;
    nspRoomsBroadcast: grpc.handleUnaryCall<api_pb.NspRoomsBroadcastReq, api_pb.NspRoomsBroadcastResp>;
    nspUsersBroadcast: grpc.handleUnaryCall<api_pb.NspUsersBroadcastReq, api_pb.NspUsersBroadcastResp>;
    disconnect: grpc.handleUnaryCall<api_pb.DisconnectReq, api_pb.DisconnectResp>;
    knockoutFromRoom: grpc.handleUnaryCall<api_pb.KnockoutReq, api_pb.KnockoutResp>;
    clearRooms: grpc.handleUnaryCall<api_pb.ClearRoomsReq, api_pb.ClearRoomsResp>;
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
    disconnect(request: api_pb.DisconnectReq, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    disconnect(request: api_pb.DisconnectReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    disconnect(request: api_pb.DisconnectReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    knockoutFromRoom(request: api_pb.KnockoutReq, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    knockoutFromRoom(request: api_pb.KnockoutReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    knockoutFromRoom(request: api_pb.KnockoutReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    clearRooms(request: api_pb.ClearRoomsReq, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
    clearRooms(request: api_pb.ClearRoomsReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
    clearRooms(request: api_pb.ClearRoomsReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
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
    public disconnect(request: api_pb.DisconnectReq, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    public disconnect(request: api_pb.DisconnectReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    public disconnect(request: api_pb.DisconnectReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.DisconnectResp) => void): grpc.ClientUnaryCall;
    public knockoutFromRoom(request: api_pb.KnockoutReq, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    public knockoutFromRoom(request: api_pb.KnockoutReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    public knockoutFromRoom(request: api_pb.KnockoutReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.KnockoutResp) => void): grpc.ClientUnaryCall;
    public clearRooms(request: api_pb.ClearRoomsReq, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
    public clearRooms(request: api_pb.ClearRoomsReq, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
    public clearRooms(request: api_pb.ClearRoomsReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.ClearRoomsResp) => void): grpc.ClientUnaryCall;
}
