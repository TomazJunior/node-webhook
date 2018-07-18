const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

// TODO: set external env
const databaseName = 'webhook'
const url = process.env.WH_MONGO_URL || 'mongodb://localhost:27017'
const tableName = 'requests'

module.exports = class Database {
  constructor () {
    this.db = null
  }

  async connect () {
    if (this.db) { return }
    console.log('mongo db url: ', url);
    this.client = await MongoClient.connect(url, { useNewUrlParser: true })
    this.db = this.client.db(databaseName)
    await this.db.createCollection(tableName)
  }

  async close () {
    await this.client.close()
  }

  async update (_id, data) {
    var filter = { _id: ObjectId(_id) }
    var newvalues = { $set: { statusCode: data.statusCode, status: data.status } }
    const requests = this.db.collection(tableName)
    const updatedData = await requests.updateOne(filter, newvalues)
    return updatedData
  }

  async insert (request) {
    const requests = this.db.collection(tableName)
    const data = await requests.insertOne(request || {})
    return data
  }

  async get (_id) {
    const requests = this.db.collection(tableName)
    var filter = { _id: ObjectId(_id) }
    var data = await requests.findOne(filter)
    return data
  }

  async getAll () {
    const requests = this.db.collection(tableName)
    const data = await requests.find({}).toArray()
    return data
  }
}
