const socket = require("socket.io-client")("http://localhost:3000/demo", {
    path: "/socket.io"
})

var roomId = process.env.room
if (roomId === '') {
    throw Error("no roomId message")
}

socket.on('connect', function () {
    console.log("namespace: ", socket.nsp, "socketId: ", socket.id);
    socket.emit("auth", { clientId: 'clientId to parse client info' })
    // socket.emit("join", { room: roomId })
    socket.emit("chat/users", { userId: socket.id, msg: { evt: "chat/users", meta: { content: "msg" }, ver: "1.0.0", id: "2312903" } })
});

// socket.on('event', function (data) {
//     console.log(data);
// });
// socket.on('disconnect', function () { });

socket.on("chat/users", data => {
    console.log(data);
})

// socket.emit("message", { you: "ok", id: 120389 }, () => {
//     console.log("recv server ack");
// })

socket.on("disconnect", () => {
    console.log("server disconnect");
    socket.close()
})
