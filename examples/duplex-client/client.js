const lib = require('../../lib/dist/lib')
const readline = require('readline')

const main = () => {
    let client = new lib.Client(
        "http://localhost:3000/demo",
        { path: "/socket.io" },
        [
            {
                evt: 'disconnect',
                cb: function (err) {
                    console.log("disconnect from server with error: ", err);
                    process.exit()
                }
            },
            {
                evt: 'chat/rooms',
                cb: function (data) {
                    let { meta } = data
                    console.log(typeof meta);
                    console.log("recv chat/rooms message", data);
                }
            },
            {
                evt: 'chat/users',
                cb: function (data) {
                    let { meta } = data
                    console.log(typeof meta);
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

    rl.question("what's your userId ?\n", function (answer) {
        userId = answer
        client.auth(userId, { meta: "foobar" }, function (data) {
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
    })

    rl.on('close', function () {
        console.log("bye");
        process.exit()
    })
}

main()