// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var api_pb = require('./api_pb.js');

function serialize_api_ClearRoomReq(arg) {
  if (!(arg instanceof api_pb.ClearRoomReq)) {
    throw new Error('Expected argument of type api.ClearRoomReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_ClearRoomReq(buffer_arg) {
  return api_pb.ClearRoomReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_ClearRoomResp(arg) {
  if (!(arg instanceof api_pb.ClearRoomResp)) {
    throw new Error('Expected argument of type api.ClearRoomResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_ClearRoomResp(buffer_arg) {
  return api_pb.ClearRoomResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DeactiveReq(arg) {
  if (!(arg instanceof api_pb.DeactiveReq)) {
    throw new Error('Expected argument of type api.DeactiveReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DeactiveReq(buffer_arg) {
  return api_pb.DeactiveReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DeactiveResp(arg) {
  if (!(arg instanceof api_pb.DeactiveResp)) {
    throw new Error('Expected argument of type api.DeactiveResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DeactiveResp(buffer_arg) {
  return api_pb.DeactiveResp.deserializeBinary(new Uint8Array(buffer_arg));
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
  // rpc NspRoomsBroadcast (NspRoomsBroadcastReq) returns (NspRoomsBroadcastResp);
  deactive: {
    path: '/api.SocketMService/Deactive',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.DeactiveReq,
    responseType: api_pb.DeactiveResp,
    requestSerialize: serialize_api_DeactiveReq,
    requestDeserialize: deserialize_api_DeactiveReq,
    responseSerialize: serialize_api_DeactiveResp,
    responseDeserialize: deserialize_api_DeactiveResp,
  },
  clearRoom: {
    path: '/api.SocketMService/ClearRoom',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.ClearRoomReq,
    responseType: api_pb.ClearRoomResp,
    requestSerialize: serialize_api_ClearRoomReq,
    requestDeserialize: deserialize_api_ClearRoomReq,
    responseSerialize: serialize_api_ClearRoomResp,
    responseDeserialize: deserialize_api_ClearRoomResp,
  },
};

exports.SocketMServiceClient = grpc.makeGenericClientConstructor(SocketMServiceService);
