# API

includes all `RPC` and `HTTP` APIs for caller to control this app.

### RPC API

|Method|desc|req|resp|
|-----|----|------|------|
|NspBroadcast|broadcast message or singal to all clients|[NspBroadcastReq](#nspbroadcastreq)|[NspBroadcastResp](#nspbroadcastresp)|
|NspRoomsBroadcast|broadcast message or singal to specified rooms|[NspRoomsBroadcastReq](#nsproomsbroadcastreq)|[NspRoomsBroadcastResp](#nsproomsbroadcastresp)|
|NspUsersBroadcast|broadcast message or singal to specified users|[NspUsersBroadcastReq](#nspusersbroadcastreq)|[NspUsersBroadcastResp](#nspusersbroadcastresp)|
|Disconnect|force server to disconnect with client|[DisconnectReq](#disconnectreq)|[DisconnectResp](#disconnectresp)|
|KnockoutFromRoom|stop someone recieving message from room(`todo`: stop sending too)|[KnockoutFromRoomReq](#knockoutfromroomreq)|[KnockoutFromRoomResp](#knockoutfromroomresp)|
|ClearRooms|remove all user from room|[ClearRoomsReq](#clearroomsreq)|[ClearRoomsResp](#clearroomsresp)|

### HTTP API

|URI|method|req|resp|
|-----|--------|------|------|

### datastructure definitions

#### Message
```proto
message Message {
    string ver = 1;
    // Any meta = 2;
    string meta = 2;
    string evt = 3;
    string id = 4;
} 
```

##### NspBroadcastReq
```proto
message NspBroadcastReq {
    string nspName = 1;
    Message msg = 2;
}
```
##### NspBroadcastResp
```proto
message NspBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```
##### NspRoomsBroadcastReq
```proto
message RoomMessage {
    string roomId = 1;
    Message msg = 2;
}

message NspRoomsBroadcastReq {
    string nspName = 1;
    repeated RoomMessage msgs = 2;
}
```
##### NspRoomsBroadcastResp
```proto
message NspRoomsBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```
##### NspUsersBroadcastReq
```proto
message UserMessage {
    int64 userId = 1;
    Message msg = 2;
}

message NspUsersBroadcastReq {
    string nspName = 1;
    repeated UserMessage msgs = 2;
}
```
##### NspUsersBroadcastResp
```proto
message NspUsersBroadcastResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```
##### DisconnectReq
```proto
message DisconnectReq {
    string nspName = 1;
    int64 userId = 2;
}
```
##### DisconnectResp
```proto
message DisconnectResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```
##### KnockoutFromRoomReq
```proto
message KnockoutMeta {
    int64 userId = 1;
    string roomId = 2;
}

message KnockoutReq {
    string nspName = 1;
    repeated KnockoutMeta metas = 2; 
}
```
##### KnockoutFromRoomResp
```proto
message KnockoutResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```
##### ClearRoomsReq
```proto
message ClearRoomsReq {
    string nspName = 1;
    repeated string roomIds = 2;
}
```
##### ClearRoomsResp
```proto
message ClearRoomsResp {
    uint32 errcode = 1;
    string errmsg = 2;
}
```