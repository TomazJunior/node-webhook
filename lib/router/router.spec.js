/* global describe, it, beforeEach */
/* eslint no-unused-expressions: 0 */

const Router = require('./router')
const { expect } = require('chai')
const NotFoundException = require('../exceptions/notFoundException')

describe('Router test', () => {
  describe('When Router is created', () => {
    let router
    const routes = [{
      url: '/about',
      method: 'get'
    }, {
      url: '/webhook/:id',
      method: 'get'
    }]
    beforeEach(() => {
      router = new Router(routes)
    })
    it('should be created', () => {
      expect(router).to.be.ok
    })
    it('should get the about endpoint', () => {
      const route = router.getRoute({ url: '/about', method: 'get' })
      expect(route).to.equal(routes.find(r => r.url === '/about'))
    })
    it('should throw a notFoundException exception when route is invalid', () => {
      const req = { url: '/test', method: 'get' }
      expect(router.getRoute.bind(router, req)).to.throw(NotFoundException)
    })
  })
})
