const IM_HOST = "localhost:3000"
const NSP_NAME = "demo"

var client = new lib.Client(
    { host: IM_HOST, nspName: NSP_NAME, path: "/socket.io", },
    [
        {
            evt: 'disconnect',
            cb: function (err) {
                console.log("disconnect from server with error: ", err);
                alert("你死了")
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
    ])

client.auth(100, { meta: "foobar" }, function (data) {
    console.log("auth evt: ", data);
})

client.join({
    rooms: ['1000', '1001'].map((v) => {
        return { roomId: v.trim() }
    })
}, function (data) {
    console.log("join evt: ", data);
})