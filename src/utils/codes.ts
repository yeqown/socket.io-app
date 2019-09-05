
export enum codes {
    Undefined = -1,
    OK = 0,
    ServerErr,
}

const _messages = new Map<number, string>();
(function (m: Map<number, string>) {
    m.set(codes.OK, "ok")
    m.set(codes.ServerErr, "server err")
    m.set(codes.Undefined, "undefined code")
}(_messages))

export const getMessage = (code: number): string => {
    let v = _messages.get(code)
    if (v === undefined) {
        return <string>_messages.get(codes.Undefined)
    }

    return v
}