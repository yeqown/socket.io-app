# socket.io-app
socket.io-based realtime app

### Features

* [x] HTTP Monitor API
* [x] gRPC Manage API
* [x] based socket.io, it's stable
* [x] `node.js` event driven

### TODOs

* [x] create examples
* [x] import unittest frame `mocha` and write
* [ ] fill all TODOs have been marked
* [ ] import `redis-adapter`
* [ ] slim client lib output, resolve lib dependecy relationship, event into one file

### Dependencies

* `redis` for session and token manage
* `nsq` or other MQ, not yet


### Basic Evts - 双工事件约定

    1. connection, 客户端建立链接事件，会主动发送一条上线消息
    2. disconnect，客户端断开链接事件，会主动发送一条下线消息
    3. chat/users，双工模式下，用户多点发送
    4. chat/rooms，双工模式下，用户多房间发送
    5. join 客户端加入房间事件
    6. join/reply 服务端针对客户端加入房间回送消息
    7. auth 客户端鉴权事件
    8. auth/reply 服务端鉴权回送消息
    9. error 所有业务中的错误信息返回事件

### RPC APIs

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