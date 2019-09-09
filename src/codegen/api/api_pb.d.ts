// package: api
// file: api.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class NspBroadcastReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;


    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspBroadcastReq): NspBroadcastReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NspBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspBroadcastReq;
    static deserializeBinaryFromReader(message: NspBroadcastReq, reader: jspb.BinaryReader): NspBroadcastReq;
}

export namespace NspBroadcastReq {
    export type AsObject = {
        nspname: string,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

export class RoomMessage extends jspb.Message { 
    getRoomid(): string;
    setRoomid(value: string): void;


    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RoomMessage.AsObject;
    static toObject(includeInstance: boolean, msg: RoomMessage): RoomMessage.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RoomMessage, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RoomMessage;
    static deserializeBinaryFromReader(message: RoomMessage, reader: jspb.BinaryReader): RoomMessage;
}

export namespace RoomMessage {
    export type AsObject = {
        roomid: string,
        msg?: Message.AsObject,
    }
}

export class NspRoomsBroadcastReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;

    clearMsgsList(): void;
    getMsgsList(): Array<RoomMessage>;
    setMsgsList(value: Array<RoomMessage>): void;
    addMsgs(value?: RoomMessage, index?: number): RoomMessage;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspRoomsBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspRoomsBroadcastReq): NspRoomsBroadcastReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NspRoomsBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspRoomsBroadcastReq;
    static deserializeBinaryFromReader(message: NspRoomsBroadcastReq, reader: jspb.BinaryReader): NspRoomsBroadcastReq;
}

export namespace NspRoomsBroadcastReq {
    export type AsObject = {
        nspname: string,
        msgsList: Array<RoomMessage.AsObject>,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

export class UserMessage extends jspb.Message { 
    getUserid(): number;
    setUserid(value: number): void;


    hasMsg(): boolean;
    clearMsg(): void;
    getMsg(): Message | undefined;
    setMsg(value?: Message): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserMessage.AsObject;
    static toObject(includeInstance: boolean, msg: UserMessage): UserMessage.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UserMessage, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserMessage;
    static deserializeBinaryFromReader(message: UserMessage, reader: jspb.BinaryReader): UserMessage;
}

export namespace UserMessage {
    export type AsObject = {
        userid: number,
        msg?: Message.AsObject,
    }
}

export class NspUsersBroadcastReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;

    clearMsgsList(): void;
    getMsgsList(): Array<UserMessage>;
    setMsgsList(value: Array<UserMessage>): void;
    addMsgs(value?: UserMessage, index?: number): UserMessage;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NspUsersBroadcastReq.AsObject;
    static toObject(includeInstance: boolean, msg: NspUsersBroadcastReq): NspUsersBroadcastReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NspUsersBroadcastReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NspUsersBroadcastReq;
    static deserializeBinaryFromReader(message: NspUsersBroadcastReq, reader: jspb.BinaryReader): NspUsersBroadcastReq;
}

export namespace NspUsersBroadcastReq {
    export type AsObject = {
        nspname: string,
        msgsList: Array<UserMessage.AsObject>,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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

export class DisconnectReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;

    getUserid(): number;
    setUserid(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectReq.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectReq): DisconnectReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectReq;
    static deserializeBinaryFromReader(message: DisconnectReq, reader: jspb.BinaryReader): DisconnectReq;
}

export namespace DisconnectReq {
    export type AsObject = {
        nspname: string,
        userid: number,
    }
}

export class DisconnectResp extends jspb.Message { 
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectResp.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectResp): DisconnectResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectResp;
    static deserializeBinaryFromReader(message: DisconnectResp, reader: jspb.BinaryReader): DisconnectResp;
}

export namespace DisconnectResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class KnockoutMeta extends jspb.Message { 
    getUserid(): number;
    setUserid(value: number): void;

    getRoomid(): string;
    setRoomid(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KnockoutMeta.AsObject;
    static toObject(includeInstance: boolean, msg: KnockoutMeta): KnockoutMeta.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KnockoutMeta, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KnockoutMeta;
    static deserializeBinaryFromReader(message: KnockoutMeta, reader: jspb.BinaryReader): KnockoutMeta;
}

export namespace KnockoutMeta {
    export type AsObject = {
        userid: number,
        roomid: string,
    }
}

export class KnockoutReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;

    clearMetasList(): void;
    getMetasList(): Array<KnockoutMeta>;
    setMetasList(value: Array<KnockoutMeta>): void;
    addMetas(value?: KnockoutMeta, index?: number): KnockoutMeta;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KnockoutReq.AsObject;
    static toObject(includeInstance: boolean, msg: KnockoutReq): KnockoutReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KnockoutReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KnockoutReq;
    static deserializeBinaryFromReader(message: KnockoutReq, reader: jspb.BinaryReader): KnockoutReq;
}

export namespace KnockoutReq {
    export type AsObject = {
        nspname: string,
        metasList: Array<KnockoutMeta.AsObject>,
    }
}

export class KnockoutResp extends jspb.Message { 
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KnockoutResp.AsObject;
    static toObject(includeInstance: boolean, msg: KnockoutResp): KnockoutResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KnockoutResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KnockoutResp;
    static deserializeBinaryFromReader(message: KnockoutResp, reader: jspb.BinaryReader): KnockoutResp;
}

export namespace KnockoutResp {
    export type AsObject = {
        errcode: number,
        errmsg: string,
    }
}

export class ClearRoomsReq extends jspb.Message { 
    getNspname(): string;
    setNspname(value: string): void;

    clearRoomidsList(): void;
    getRoomidsList(): Array<string>;
    setRoomidsList(value: Array<string>): void;
    addRoomids(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearRoomsReq.AsObject;
    static toObject(includeInstance: boolean, msg: ClearRoomsReq): ClearRoomsReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearRoomsReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearRoomsReq;
    static deserializeBinaryFromReader(message: ClearRoomsReq, reader: jspb.BinaryReader): ClearRoomsReq;
}

export namespace ClearRoomsReq {
    export type AsObject = {
        nspname: string,
        roomidsList: Array<string>,
    }
}

export class ClearRoomsResp extends jspb.Message { 
    getErrcode(): number;
    setErrcode(value: number): void;

    getErrmsg(): string;
    setErrmsg(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearRoomsResp.AsObject;
    static toObject(includeInstance: boolean, msg: ClearRoomsResp): ClearRoomsResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearRoomsResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearRoomsResp;
    static deserializeBinaryFromReader(message: ClearRoomsResp, reader: jspb.BinaryReader): ClearRoomsResp;
}

export namespace ClearRoomsResp {
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
