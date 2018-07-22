/* global describe, it, afterEach, beforeEach */
/* eslint no-unused-expressions: 0 */

const { expect } = require('chai')
const fs = require('fs')
const cp = require('child_process')
const Router = require('./router')
const sinon = require('sinon')

describe('Routes tests', () => {
  let router
  let sandbox
  let res = {}
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    res.writeHead = sandbox.stub()
  })
  afterEach(() => {
    sandbox.restore()
  })
  describe('when /about is called', () => {
    it('should retrieve data', async () => {
      sandbox.stub(fs, 'readFile').yields(null, 'ok')
      sandbox.stub(cp, 'fork').returns({ on: sandbox.stub() })
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/about', method: 'get' })
      const result = await route.send(null, res)
      expect(result).to.equal('ok')
    })
    it('should fail on error', async () => {
      const errorMessage = 'error message'
      sandbox.stub(fs, 'readFile').yields(errorMessage)
      sandbox.stub(cp, 'fork').returns({ on: sandbox.stub() })
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/about', method: 'get' })
      try {
        await route.send(null, res)
      } catch (error) {
        expect(error).to.equal(errorMessage)
      }
    })
  })
})
