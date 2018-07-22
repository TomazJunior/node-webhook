/* global describe, it, before, after */
/* jshint expr: true */
/* eslint no-unused-expressions: 0 */

const Database = require('./db')
const {expect} = require('chai')
const sinon = require('sinon')
const { ObjectId, MongoClient } = require('mongodb')

describe('Database Class Test', () => {
  let sandbox
  let database
  process.env.WH_MONGO_URL = ''
  describe('When connect success', () => {
    let client
    let updateOneStub
    let insertOneStub
    let findOneStub
    let findStub
    before(() => {
      sandbox = sinon.createSandbox()
      updateOneStub = sandbox.stub()
      insertOneStub = sandbox.stub()
      findOneStub = sandbox.stub()
      findStub = sandbox.stub().returns({
        toArray: sandbox.stub()
      })
      client = {
        db: (databaseName) => {
          return {
            databaseName,
            createCollection: () => {},
            collection: sandbox.stub().returns({
              updateOne: updateOneStub,
              insertOne: insertOneStub,
              findOne: findOneStub,
              find: findStub
            })
          }
        },
        close: sandbox.stub()
      }
      sandbox.stub(MongoClient, 'connect').returns(client)
      database = new Database()
    })
    after(() => {
      sandbox.restore()
    })
    it('should create instanse', () => {
      expect(database).to.not.be.null
    })
    it('should connect to database', async () => {
      await database.connect()
      sinon.assert.callCount(MongoClient.connect, 1)
      expect(database.db).to.not.be.null
    })
    it('should update item', async () => {
      const _id = '5b4fa8cd822fce0fb1102ecf'
      const data = {
        statusCode: 200,
        status: 'ok'
      }
      await database.update(_id, data)
      sinon.assert.calledOnce(updateOneStub)
      updateOneStub.calledWith(
        { _id: ObjectId(_id) },
        { $set: { statusCode: data.statusCode, status: data.status } }
      )
    })
    it('should insert item', async () => {
      const request = {
        port: 443,
        protocol: 'https:',
        host: 'github.com',
        path: '/TomazJunior/node-webhook'
      }
      await database.insert(request)
      sinon.assert.calledOnce(insertOneStub)
      insertOneStub.calledWith(request)
    })
    it('should get item', async () => {
      const _id = '5b4fa8cd822fce0fb1102ecf'
      await database.get(_id)
      sinon.assert.calledOnce(findOneStub)
      findOneStub.calledWith({ _id: ObjectId(_id) })
    })
    it('should get all items', async () => {
      await database.getAll()
      sinon.assert.calledOnce(findStub)
      findStub.calledWith({ })
    })
    it('should close database connection', async () => {
      await database.close()
      sinon.assert.callCount(client.close, 1)
    })
  })

  describe('When connect success at the second attempt', () => {
    before(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(MongoClient, 'connect').onFirstCall().throws('connection failure')
        .onSecondCall().returns({
          db: (databaseName) => {
            return {
              databaseName,
              createCollection: () => {}
            }
          }
        })
      database = new Database()
    })
    after(() => {
      sandbox.restore()
    })
    it('should create instanse', () => {
      expect(database).to.not.be.null
    })
    it('should connect to database', async () => {
      await database.connect()
      sinon.assert.callCount(MongoClient.connect, 2)
      expect(database.db).to.not.be.null
    })
  })

  describe('When connect fails', () => {
    before(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(MongoClient, 'connect').throws('connection failure')
      database = new Database()
    })
    after(() => {
      sandbox.restore()
    })
    it('should create instanse', () => {
      expect(database).to.not.be.null
    })
    it('should not connect to database', async () => {
      try {
        await database.connect(2)
      } catch (error) {
        expect(error.message).to.equal('error connecting DB')
      }
      sinon.assert.callCount(MongoClient.connect, 2)
      expect(database.db).to.be.null
    })
  })
})
