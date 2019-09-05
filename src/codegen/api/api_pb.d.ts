// package: api
// file: api.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class NspBroadcastReq extends jspb.Message {

    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspBroadcastReq): NspBroadcastReq.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspBroadcastReq;
    static deserializeBinaryFromReader(message: NspBroadcastReq, reader: jspb.BinaryReader): NspBroadcastReq;
}

export namespace NspBroadcastReq {
    export type AsObject = {
        msg?: Message.AsObject,
    }
}

export class NspBroadcastResp extends jspb.Message {
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspBroadcastResp.AsObject;
    static toObject(includeInstance: boolean, msg: NspBroadcastResp): NspBroadcastResp.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspBroadcastResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspBroadcastResp;
    static deserializeBinaryFromReader(message: NspBroadcastResp, reader: jspb.BinaryReader): NspBroadcastResp;
}

export namespace NspBroadcastResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class NspRoomsBroadcastReq extends jspb.Message {
    clearRoomsList(): void;
    getRoomsList(): Array<string>;
    setRoomsList(value: Array<string>): void;
    addRooms(value: string, index?: number): string;


    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspRoomsBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspRoomsBroadcastReq): NspRoomsBroadcastReq.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspRoomsBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspRoomsBroadcastReq;
    static deserializeBinaryFromReader(message: NspRoomsBroadcastReq, reader: jspb.BinaryReader): NspRoomsBroadcastReq;
}

export namespace NspRoomsBroadcastReq {
    export type AsObject = {
        roomsList: Array<string>,
        msg?: Message.AsObject,
    }
}

export class NspRoomsBroadcastResp extends jspb.Message {
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspRoomsBroadcastResp.AsObject;
    static toObject(includeInstance: boolean, msg: NspRoomsBroadcastResp): NspRoomsBroadcastResp.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspRoomsBroadcastResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspRoomsBroadcastResp;
    static deserializeBinaryFromReader(message: NspRoomsBroadcastResp, reader: jspb.BinaryReader): NspRoomsBroadcastResp;
}

export namespace NspRoomsBroadcastResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class NspUsersBroadcastReq extends jspb.Message {
    clearUsersList(): void;
    getUsersList(): Array<number>;
    setUsersList(value: Array<number>): void;
    addUsers(value: number, index?: number): number;


    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspUsersBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspUsersBroadcastReq): NspUsersBroadcastReq.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspUsersBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspUsersBroadcastReq;
    static deserializeBinaryFromReader(message: NspUsersBroadcastReq, reader: jspb.BinaryReader): NspUsersBroadcastReq;
}

export namespace NspUsersBroadcastReq {
    export type AsObject = {
        usersList: Array<number>,
        msg?: Message.AsObject,
    }
}

export class NspUsersBroadcastResp extends jspb.Message {
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspUsersBroadcastResp.AsObject;
    static toObject(includeInstance: boolean, msg: NspUsersBroadcastResp): NspUsersBroadcastResp.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: NspUsersBroadcastResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspUsersBroadcastResp;
    static deserializeBinaryFromReader(message: NspUsersBroadcastResp, reader: jspb.BinaryReader): NspUsersBroadcastResp;
}

export namespace NspUsersBroadcastResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class DeactiveReq extends jspb.Message {
    getToken(): string;
    setToken(value: string): void;

    getUserid(): number;
    setUserid(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeactiveReq.AsObject;
    static toObject(includeInstance: boolean, msg: DeactiveReq): DeactiveReq.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: DeactiveReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeactiveReq;
    static deserializeBinaryFromReader(message: DeactiveReq, reader: jspb.BinaryReader): DeactiveReq;
}

export namespace DeactiveReq {
    export type AsObject = {
        token: string,
        userid: number,
    }
}

export class DeactiveResp extends jspb.Message {
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeactiveResp.AsObject;
    static toObject(includeInstance: boolean, msg: DeactiveResp): DeactiveResp.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: DeactiveResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeactiveResp;
    static deserializeBinaryFromReader(message: DeactiveResp, reader: jspb.BinaryReader): DeactiveResp;
}

export namespace DeactiveResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class ClearRoomReq extends jspb.Message {
    clearRoomidsList(): void;
    getRoomidsList(): Array<string>;
    setRoomidsList(value: Array<string>): void;
    addRoomids(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearRoomReq.AsObject;
    static toObject(includeInstance: boolean, msg: ClearRoomReq): ClearRoomReq.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: ClearRoomReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearRoomReq;
    static deserializeBinaryFromReader(message: ClearRoomReq, reader: jspb.BinaryReader): ClearRoomReq;
}

export namespace ClearRoomReq {
    export type AsObject = {
        roomidsList: Array<string>,
    }
}

export class ClearRoomResp extends jspb.Message {
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearRoomResp.AsObject;
    static toObject(includeInstance: boolean, msg: ClearRoomResp): ClearRoomResp.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: ClearRoomResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearRoomResp;
    static deserializeBinaryFromReader(message: ClearRoomResp, reader: jspb.BinaryReader): ClearRoomResp;
}

export namespace ClearRoomResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class Message extends jspb.Message {
    getVer(): string;
    setVer(value: string): void;

    getMeta(): string;
    setMeta(value: string): void;

    getEvt(): string;
    setEvt(value: string): void;

    getId(): string;
    setId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Message.AsObject;
    static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Message;
    static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
    export type AsObject = {
        ver: string,
        meta: string,
        evt: string,
        id: string,
    }
}
