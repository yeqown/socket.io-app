# Examples

## prepare for examples [dev]

1. start server, `cd socket.io-app && npm i && npm run dev`
2. compile `lib`, `cd lib && npm i && npm run compile`
3. start `client.js`, `cd examples/$EXAMPLE_NAME && node client.js`

## duplex-client output

```sh
cd duplex-client && node client.js

➜  duplex-client git:(develop) ✗ node client.js
what's your userId ?
102
what's your roomId ?
1001
recv chat/rooms message { ver: '1.0.0',
  id: '644972d1-9357-4caf-a9f3-f5f43b9656a3',
  evt: 'chat/rooms',
  meta: { content: 'interval', roomId: '1001' } }
recv chat/rooms message { ver: '1.0.0',
  id: '3d3d740c-085c-4968-bea0-9b18ee481ac0',
  evt: 'chat/rooms',
  meta: { content: 'interval', roomId: '1001' } }
```

## chatroom frontend [TODO:]

## grpc commands scripts

common import and initialize
```js
const grpc_pb = require('../../src/codegen/api/api_grpc_pb')
const api_pb = require('../../src/codegen/api/api_pb')
const grpc = require('grpc')

let { GRPC_HOST } = process.env
if (!GRPC_HOST) {
    throw Error("empty GRPC_HOST in env list")
}

const client = new grpc_pb.SocketMServiceClient(GRPC_HOST, grpc.credentials.createInsecure())
```

### 1.broadcast
```js
let req = new api_pb.NspBroadcastReq()
let msg = new api_pb.Message()

msg.setVer("1.0.0")
msg.setId("29381023jj")
msg.setEvt("chat/rooms")
msg.setMeta(JSON.stringify({ foo: "bar", code: 1 }))
req.setMsg(msg)
req.setNspname("demo")


client.nspBroadcast(req, (err, resp) => {
    console.log('nsp broadcast', req)
    console.log("result (err, resp): ", err, resp)
})
```

### 2.knockout
```js
let req = new api_pb.KnockoutReq()
req.setNspname("demo")

let metas = [100].map((v) => {
    let meta = new api_pb.KnockoutMeta()
    meta.setUserid(v)
    meta.setRoomid('1001')
    return meta
})
req.setMetasList(metas)


client.knockoutFromRoom(req, (err, resp) => {
    console.log('knockout 100 from 1001 with req:', req)
    console.log("result (err, resp): ", err, resp)
})
```