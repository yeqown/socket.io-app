## Basic Evts - 双工事件约定

    1. connection, 客户端建立链接事件，会主动发送一条上线消息
    2. disconnect，客户端断开链接事件，会主动发送一条下线消息
    3. chat/users，双工模式下，用户多点发送
    4. chat/rooms，双工模式下，用户多房间发送
    5. join 客户端加入房间事件
    6. join/reply 服务端针对客户端加入房间回送消息
    7. auth 客户端鉴权事件
    8. auth/reply 服务端鉴权回送消息
    9. logic/error 所有业务中的错误信息返回事件
