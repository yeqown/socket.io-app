# socket.io-app
socket.io-based realtime app

### Features

* [x] HTTP Monitor API, monitor nodes, nsp, users stats
* [x] gRPC Manage API, support server manage self-defined evt
* [x] based socket.io, it's stable
* [x] `node.js` event driven

### TODOs

* [x] create examples
* [x] import unittest frame `mocha` and write
* [x] plugin session manager
* [ ] fill gRPC server functions
* [ ] fill http monitor handlers
* [ ] fill all TODOs have been marked
* [ ] import `redis-adapter`
* [ ] slim client lib output, resolve lib dependecy relationship, event into one file

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