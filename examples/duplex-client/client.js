const lib = require('../../lib/dist/lib')
const readline = require('readline')

const main = () => {
    let client = new lib.Client(
        "http://localhost:3000/demo",
        { path: "/socket.io" },
        [
            {
                evt: 'chat/rooms',
                cb: function (data) {
                    console.log("recv chat/rooms message", data);
                }
            },
            {
                evt: 'chat/users',
                cb: function (data) {
                    console.log("recv chat/users message", data);
                }
            },
        ]
    )

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    let userId = 10;
    let roomId = '1000'

    rl.question("what's your userId ?\n", function (answer) {
        userId = answer
        client.auth({ userId }, function (data) {
            console.log("auth evt: ", data);
        })

        rl.question("what's your roomId ?\n", function (answer) {
            let roomIds = answer.split(",")
            client.join({
                rooms: roomIds.map((v) => {
                    return { roomId: v.trim() }
                })
            }, function (data) {
                console.log("join evt: ", data);
            })

            let t = setInterval(function () {
                let roomId = roomIds[Math.floor(Math.random() * 10) % roomIds.length]
                client.sendInRoom(roomId, { content: "interval", roomId: roomId })
            }, 5000)
        })

    })


    rl.on('line', function (line) {
        rl.prompt()
        // let s = line.trim()
        // switch (s) {
        //     case '':
        //         break
        //     default:
        // }
        // rl.prompt()
    })

    rl.on('close', function () {
        console.log("bye");
        process.exit()
    })
}

main()

// const socket = require("socket.io-client")("http://localhost:3000/demo", {
//     path: "/socket.io"
// })

// var roomId = process.env.room
// if (roomId === '') {
//     throw Error("no roomId message")
// }

// socket.on('connect', function () {
//     console.log("namespace: ", socket.nsp, "socketId: ", socket.id);
//     socket.emit("auth", { clientId: 'clientId to parse client info' })
//     // socket.emit("join", { room: roomId })
//     socket.emit("chat/users", { userId: socket.id, msg: { evt: "chat/users", meta: { content: "msg" }, ver: "1.0.0", id: "2312903" } })
// });

// // socket.on('event', function (data) {
// //     console.log(data);
// // });
// // socket.on('disconnect', function () { });

// socket.on("chat/users", data => {
//     console.log(data);
// })

// // socket.emit("message", { you: "ok", id: 120389 }, () => {
// //     console.log("recv server ack");
// // })

// socket.on("disconnect", () => {
//     console.log("server disconnect");
//     socket.close()
// })