/* global describe, it, afterEach, beforeEach */
/* eslint no-unused-expressions: 0 */

const { expect } = require('chai')
const fs = require('fs')
const cp = require('child_process')
const Router = require('./router')
const sinon = require('sinon')

describe('Routes tests', () => {
  const requestItem = { id: 123456 }
  let router
  let sandbox
  let res = {}
  let req = { database: { } }
  let webhook
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    res.writeHead = sandbox.stub()
    req.database.insert = sandbox.stub().returns({ insertedId: 123456 })
    req.database.get = sandbox.stub().returns(requestItem)
    req.database.getAll = sandbox.stub().returns([requestItem])
    sandbox.stub(cp, 'fork').returns({ on: sandbox.stub() })
  })
  afterEach(() => {
    sandbox.restore()
  })
  describe('when /about is called', () => {
    it('should retrieve data', async () => {
      sandbox.stub(fs, 'readFile').yields(null, 'ok')
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/about', method: 'get' })
      const result = await route.send(null, res)
      expect(result).to.equal('ok')
    })
    it('should fail on error', async () => {
      const errorMessage = 'error message'
      sandbox.stub(fs, 'readFile').yields(errorMessage)
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/about', method: 'get' })
      try {
        await route.send(null, res)
      } catch (error) {
        expect(error).to.equal(errorMessage)
      }
    })
  })

  describe('when /webhook is called', () => {
    beforeEach(() => {
      webhook = require('../webhook/webhook')
      sandbox.stub(webhook, 'execute')
    })
    it('should post data', async () => {
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/webhook', method: 'post' })
      const result = await route.send(req, res)
      expect(result).to.eql({ id: 123456, status: 'pending' })
    })
  })

  describe('when POST /webhook is called', () => {
    beforeEach(() => {
      webhook = require('../webhook/webhook')
      sandbox.stub(webhook, 'execute')
    })
    it('should post data', async () => {
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/webhook', method: 'post' })
      const result = await route.send(req, res)
      expect(result).to.eql({ id: 123456, status: 'pending' })
    })
  })

  describe('when /webhook/:id is called', () => {
    it('should get data', async () => {
      router = new Router(require('./routes'))
      req.url = '/webhook/123456'
      const route = router.getRoute({ url: req.url, method: 'get' })
      const result = await route.send(req, res)
      expect(result).to.eql(requestItem)
    })
  })

  describe('when get all /webhook is called', () => {
    it('should get data', async () => {
      router = new Router(require('./routes'))
      const route = router.getRoute({ url: '/webhook', method: 'get' })
      const result = await route.send(req, res)
      expect(result).to.eql([requestItem])
    })
  })
})
