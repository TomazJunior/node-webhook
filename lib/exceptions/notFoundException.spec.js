/* global describe, it */
/* eslint no-unused-expressions: 0 */

const { expect } = require('chai')
const NotFoundException = require('./notFoundException')

describe('Not Found Exception test', () => {
  it('Should create instance', () => {
    const messageError = 'test not found exception'
    const notFoundException = new NotFoundException(messageError)
    expect(notFoundException instanceof Error).to.be.ok
    expect(notFoundException.message).to.equal(messageError)
    expect(notFoundException.code).to.equal(404)
  })
})
