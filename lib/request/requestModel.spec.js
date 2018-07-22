/* global describe, it, beforeEach */
/* eslint no-unused-expressions: 0 */

const RequestModel = require('./requestModel')
const { expect } = require('chai')

describe('Request model test', () => {
  describe('When request a json object', () => {
    let requestModel
    beforeEach(() => {
      requestModel = new RequestModel({
        res: {
          statusCode: 200,
          headers: {
            'content-type': 'application/json'
          }
        },
        body: JSON.stringify({
          value: 1
        })
      })
    })
    it('It should return a parsed JSON', () => {
      expect(requestModel.body instanceof Object).to.ok
      expect(requestModel.body.value).to.equal(1)
    })
  })
  describe('When request a plan text', () => {
    let requestModel
    beforeEach(() => {
      requestModel = new RequestModel({
        res: {
          statusCode: 200,
          headers: {
            'content-type': 'text/plain'
          }
        },
        body: 'text plan'
      })
    })
    it('It should return a text plan', () => {
      expect(requestModel.body).to.equal('text plan')
    })
  })
})
