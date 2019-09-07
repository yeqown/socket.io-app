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