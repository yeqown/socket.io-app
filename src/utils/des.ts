enum DesAlg {
    CBC = "des-cbc",
    ECB = "des-ecb",
}

class Des {
    _alg: DesAlg
    constructor(alg: DesAlg) {
        this._alg = alg
    }
}

export {
    Des, DesAlg
}