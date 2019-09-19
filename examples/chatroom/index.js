$(function () {
    var FADE_TIME = 150; // ms
    // var TYPING_TsIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $roomidsInput = $('.roomidsInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page

    // Prompt for setting a username
    var username;
    var roomIds;
    var connected = false;
    var client;

    const initialClient = () => {
        const IM_HOST = "localhost:3000"
        const NSP_NAME = "demo"

        const authAndJoin = () => {
            const userId = Math.ceil(Math.random() * 1000)
            console.log('----------userId and roomIds', userId, roomIds)
            client.auth(userId, { meta: "foobar" }, function (data) {
                console.log("auth evt: ", data);
                if (data.errcode === 0) {
                    connected = true
                } else {
                    alert("connect to server error: ", data.errmsg)
                }
            })

            client.join({
                rooms: roomIds.map((v) => {
                    return { roomId: v.trim() }
                })
            }, function (data) {
                console.log("join evt: ", data);
            })
        }

        client = new lib.Client(
            { host: IM_HOST, nspName: NSP_NAME, path: "/socket.io", },
            [
                {
                    evt: 'disconnect',
                    cb: function (err) {
                        console.log("disconnect from server with error: ", err);
                        connected = false
                        alert("disconnect with server:" + err.message)
                    }
                },
                {
                    evt: 'chat/rooms',
                    cb: function (data) {
                        let { meta } = data
                        console.log("recv message: ", data, meta)
                        if (typeof meta === 'string') {
                            meta = JSON.parse(meta)
                        }
                        addChatMessage(meta)
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

        authAndJoin()
        client._socket.on('reconnect', () => {
            log('you have been reconnected');
            connected = true
            authAndJoin()
        });

        client._socket.on('reconnect_error', () => {
            log('attempt to reconnect has failed');
        });
    }

    // Sets the client's username
    const setUsername = () => {
        username = cleanInput($usernameInput.val().trim());
        _roomIds = cleanInput($roomidsInput.val().trim())
        roomIds = _roomIds.split(",")

        // If the username is valid
        if (username && _roomIds && _roomIds.length) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click')
            initialClient()
        } else {
            alert("finish your information to chat")
            roomIds = null
        }
    }

    // Sends a chat message
    const sendMessage = () => {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            let idx = Math.ceil(Math.random() * 10) % roomIds.length
            let roomId = roomIds[idx]
            console.log("-----------send message to room: ", roomId, message)
            client.sendInRoom(roomId,
                {
                    content: message,
                    roomId: roomId,
                    username: username,
                })
        }
    }

    // Log a message
    const log = (message, options) => {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $roomIdDiv = $('<span class="roomid"/>')
            .text(`[${data.roomId}]`)
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.content);

        // var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            // .addClass(typingClass)
            .append($roomIdDiv, $usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    const addMessageElement = (el, options) => {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events
    $window.keydown(event => {
        // When the client hits ENTER on their keyboard
        // console.log(event)
        if (event.which === 13) {
            if (username && roomIds && roomIds.length) {
                sendMessage();
            } else {
                console.log("set username");
                setUsername();
            }
        }
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
        $inputMessage.focus();
    });
});