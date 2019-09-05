const describe = require('mocha').describe
const assert = require("assert")
const AuthReply = require("../../dist/types").AuthReply

describe("types", function () {
    it("AuthReply", function () {
        let ar = new AuthReply(0, "ok");
        assert(ar.errcode === 0)
        assert(ar.errmsg = "ok")
    })
})