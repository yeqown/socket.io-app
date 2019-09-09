## RPC APIs

```proto
service SocketMService {
    rpc NspBroadcast (NspBroadcastReq) returns (NspBroadcastResp);
    rpc NspRoomsBroadcast (NspRoomsBroadcastReq) returns (NspRoomsBroadcastResp);
    rpc NspUsersBroadcast (NspUsersBroadcastReq) returns (NspUsersBroadcastResp);
    // rpc NspRoomsBroadcast (NspRoomsBroadcastReq) returns (NspRoomsBroadcastResp);
    rpc Deactive (DeactiveReq) returns (DeactiveResp);
    rpc ClearRoom (ClearRoomReq) returns (ClearRoomResp);
}

message NspBroadcastReq {
    Message msg = 1;
}

message NspBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message NspRoomsBroadcastReq {
    repeated string rooms = 1;
    Message msg = 2;
}

message NspRoomsBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message NspUsersBroadcastReq {
    repeated int64 users = 1;
    Message msg = 2;
}


message NspUsersBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message DeactiveReq {
    string token = 1;
    int64 userId = 2; 
}

message DeactiveResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message ClearRoomReq {
    repeated string roomIds = 1;
}

message ClearRoomResp {
    uint32 errcode = 1;
    string errmsg = 2;
}

message Message {
    string ver = 1;
    // google.protobuf.Any meta = 2;
    string meta = 2;
    string evt = 3;
    string id = 4;
} 
```