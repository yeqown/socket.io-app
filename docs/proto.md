## RPC APIs

### API.PROTO

```proto
syntax = "proto3";

// import "google/protobuf/any.proto";

package api;

service SocketMService {
    // broadcast to all rooms under nspName
    rpc NspBroadcast (NspBroadcastReq) returns (NspBroadcastResp);
    // broadcast to rooms under nspName
    rpc NspRoomsBroadcast (NspRoomsBroadcastReq) returns (NspRoomsBroadcastResp);
    // broadcast to someones
    rpc NspUsersBroadcast (NspUsersBroadcastReq) returns (NspUsersBroadcastResp);
    // make client is in condition be forced to disconnect
    rpc Disconnect(DisconnectReq) returns (DisconnectResp);
    // make clients in specified room to force leaving
    rpc KnockoutFromRoom (KnockoutReq) returns (KnockoutResp);
    // make clients to force leaving
    rpc ClearRooms (ClearRoomsReq) returns (ClearRoomsResp);
}

message NspBroadcastReq {
    string nspName = 1;
    Message msg = 2;
}

message NspBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message RoomMessage {
    string roomId = 1;
    Message msg = 2;
}

message NspRoomsBroadcastReq {
    string nspName = 1;
    repeated RoomMessage msgs = 2;
}

message NspRoomsBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message UserMessage {
    int64 userId = 1;
    Message msg = 2;
}

message NspUsersBroadcastReq {
    string nspName = 1;
    repeated UserMessage msgs = 2;
}

message NspUsersBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message DisconnectReq {
    string nspName = 1;
    int64 userId = 2;
}

message DisconnectResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message KnockoutMeta {
    int64 userId = 1;
    string roomId = 2;
}

message KnockoutReq {
    string nspName = 1;
    repeated KnockoutMeta metas = 2; 
}

message KnockoutResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message ClearRoomsReq {
    string nspName = 1;
    repeated string roomIds = 2;
}

message ClearRoomsResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message Message {
    string ver = 1;
    // Any meta = 2;
    string meta = 2;
    string evt = 3;
    string id = 4;
} 
```

### generated files

all in [codegen](../src/codegen/api)