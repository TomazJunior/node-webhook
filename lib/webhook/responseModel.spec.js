/* global describe, it */

const ResponseModel = require('./responseModel')
const { expect } = require('sinon')

describe('Response model test', () => {
  it('Should set peding status as default', () => {
    const responseModel = new ResponseModel({ id: 12345 })
    expect(responseModel.id).to.equal(12345)
    expect(responseModel.status).to.equal('pending')
  })
  it('Should set status when status is defined', () => {
    const responseModel = new ResponseModel({ id: 12345, status: 'done' })
    expect(responseModel.id).to.equal(12345)
    expect(responseModel.status).to.equal('done')
  })
})
