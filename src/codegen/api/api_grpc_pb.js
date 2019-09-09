// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var api_pb = require('./api_pb.js');

function serialize_api_ClearRoomsReq(arg) {
  if (!(arg instanceof api_pb.ClearRoomsReq)) {
    throw new Error('Expected argument of type api.ClearRoomsReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_ClearRoomsReq(buffer_arg) {
  return api_pb.ClearRoomsReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_ClearRoomsResp(arg) {
  if (!(arg instanceof api_pb.ClearRoomsResp)) {
    throw new Error('Expected argument of type api.ClearRoomsResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_ClearRoomsResp(buffer_arg) {
  return api_pb.ClearRoomsResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DisconnectReq(arg) {
  if (!(arg instanceof api_pb.DisconnectReq)) {
    throw new Error('Expected argument of type api.DisconnectReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DisconnectReq(buffer_arg) {
  return api_pb.DisconnectReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DisconnectResp(arg) {
  if (!(arg instanceof api_pb.DisconnectResp)) {
    throw new Error('Expected argument of type api.DisconnectResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DisconnectResp(buffer_arg) {
  return api_pb.DisconnectResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_KnockoutReq(arg) {
  if (!(arg instanceof api_pb.KnockoutReq)) {
    throw new Error('Expected argument of type api.KnockoutReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_KnockoutReq(buffer_arg) {
  return api_pb.KnockoutReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_KnockoutResp(arg) {
  if (!(arg instanceof api_pb.KnockoutResp)) {
    throw new Error('Expected argument of type api.KnockoutResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_KnockoutResp(buffer_arg) {
  return api_pb.KnockoutResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspBroadcastReq(arg) {
  if (!(arg instanceof api_pb.NspBroadcastReq)) {
    throw new Error('Expected argument of type api.NspBroadcastReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspBroadcastReq(buffer_arg) {
  return api_pb.NspBroadcastReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspBroadcastResp(arg) {
  if (!(arg instanceof api_pb.NspBroadcastResp)) {
    throw new Error('Expected argument of type api.NspBroadcastResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspBroadcastResp(buffer_arg) {
  return api_pb.NspBroadcastResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspRoomsBroadcastReq(arg) {
  if (!(arg instanceof api_pb.NspRoomsBroadcastReq)) {
    throw new Error('Expected argument of type api.NspRoomsBroadcastReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspRoomsBroadcastReq(buffer_arg) {
  return api_pb.NspRoomsBroadcastReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspRoomsBroadcastResp(arg) {
  if (!(arg instanceof api_pb.NspRoomsBroadcastResp)) {
    throw new Error('Expected argument of type api.NspRoomsBroadcastResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspRoomsBroadcastResp(buffer_arg) {
  return api_pb.NspRoomsBroadcastResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspUsersBroadcastReq(arg) {
  if (!(arg instanceof api_pb.NspUsersBroadcastReq)) {
    throw new Error('Expected argument of type api.NspUsersBroadcastReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspUsersBroadcastReq(buffer_arg) {
  return api_pb.NspUsersBroadcastReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_NspUsersBroadcastResp(arg) {
  if (!(arg instanceof api_pb.NspUsersBroadcastResp)) {
    throw new Error('Expected argument of type api.NspUsersBroadcastResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_NspUsersBroadcastResp(buffer_arg) {
  return api_pb.NspUsersBroadcastResp.deserializeBinary(new Uint8Array(buffer_arg));
}


var SocketMServiceService = exports.SocketMServiceService = {
  // broadcast to all rooms under nspName
  nspBroadcast: {
    path: '/api.SocketMService/NspBroadcast',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NspBroadcastReq,
    responseType: api_pb.NspBroadcastResp,
    requestSerialize: serialize_api_NspBroadcastReq,
    requestDeserialize: deserialize_api_NspBroadcastReq,
    responseSerialize: serialize_api_NspBroadcastResp,
    responseDeserialize: deserialize_api_NspBroadcastResp,
  },
  // broadcast to rooms under nspName
  nspRoomsBroadcast: {
    path: '/api.SocketMService/NspRoomsBroadcast',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NspRoomsBroadcastReq,
    responseType: api_pb.NspRoomsBroadcastResp,
    requestSerialize: serialize_api_NspRoomsBroadcastReq,
    requestDeserialize: deserialize_api_NspRoomsBroadcastReq,
    responseSerialize: serialize_api_NspRoomsBroadcastResp,
    responseDeserialize: deserialize_api_NspRoomsBroadcastResp,
  },
  // broadcast to someones
  nspUsersBroadcast: {
    path: '/api.SocketMService/NspUsersBroadcast',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.NspUsersBroadcastReq,
    responseType: api_pb.NspUsersBroadcastResp,
    requestSerialize: serialize_api_NspUsersBroadcastReq,
    requestDeserialize: deserialize_api_NspUsersBroadcastReq,
    responseSerialize: serialize_api_NspUsersBroadcastResp,
    responseDeserialize: deserialize_api_NspUsersBroadcastResp,
  },
  // make client is in condition be forced to disconnect
  disconnect: {
    path: '/api.SocketMService/Disconnect',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.DisconnectReq,
    responseType: api_pb.DisconnectResp,
    requestSerialize: serialize_api_DisconnectReq,
    requestDeserialize: deserialize_api_DisconnectReq,
    responseSerialize: serialize_api_DisconnectResp,
    responseDeserialize: deserialize_api_DisconnectResp,
  },
  // make clients in specified room to force leaving
  knockoutFromRoom: {
    path: '/api.SocketMService/KnockoutFromRoom',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.KnockoutReq,
    responseType: api_pb.KnockoutResp,
    requestSerialize: serialize_api_KnockoutReq,
    requestDeserialize: deserialize_api_KnockoutReq,
    responseSerialize: serialize_api_KnockoutResp,
    responseDeserialize: deserialize_api_KnockoutResp,
  },
  // make clients to force leaving
  clearRooms: {
    path: '/api.SocketMService/ClearRooms',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ClearRoomsReq,
    responseType: api_pb.ClearRoomsResp,
    requestSerialize: serialize_api_ClearRoomsReq,
    requestDeserialize: deserialize_api_ClearRoomsReq,
    responseSerialize: serialize_api_ClearRoomsResp,
    responseDeserialize: deserialize_api_ClearRoomsResp,
  },
};

exports.SocketMServiceClient = grpc.makeGenericClientConstructor(SocketMServiceService);
