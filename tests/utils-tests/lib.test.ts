import { describe, it } from 'mocha'
import assert from 'assert'

import { addSlashLeft, rmSlashLeft } from '../../src/utils'

describe('utils', () => {
    let origin = 'demo'
    let target = "/demo"

    it('addSlashLeft', () => {
        assert(addSlashLeft(origin) === target)
    })

    it('rmSlashLeft', () => {
        assert(rmSlashLeft(target) === origin)
    })
})