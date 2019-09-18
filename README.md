# socket.io-app
socket.io-based realtime app

### Features

* [x] HTTP Monitor API, monitor nodes, nsp, users stats
* [x] gRPC Manage API, support server manage self-defined evt. !!!!only support sigle node yet.
* [x] based socket.io, it's stable
* [x] `node.js` event driven

### TODOs

* [x] create examples
* [x] import unittest frame `mocha` and write
* [x] plugin session manager
* [x] fill gRPC server functions
* [x] support nsp config with Database
* [ ] fill http monitor handlers with class `logic/Monitor`
* [x] slim client lib output, resolving lib dependecy relationship, event into one file
* [x] import and use `redis-adapter`
* [x] RPC support multi-node also to synchronize nspConfig, plan is: based on `redis` and `middleware` pattern
* [ ] fill API docs

### Dependencies

* `redis` for session manage
* `mongodb` from namespace configs ...
* `nsq` or other MQ, not yet


### Documents

|Part|Link|
|-----|------|
|Architecture|[docs/arch](docs/arch.md)|
|Proto Defination|[docs/proto](docs/proto.md)|
|SocketIO Event|[docs/socketio](docs/socketio.md)|
|API|[docs/api](docs/api.md)|