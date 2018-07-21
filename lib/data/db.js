const { ObjectId, MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectID

// TODO: set external env
const databaseName = 'webhook'
const url = process.env.WH_MONGO_URL || 'mongodb://localhost:27017'
const tableName = 'requests'

module.exports = class Database {
  constructor (retries) {
    this.db = null
  }

  async connect(retries = 10) {
    console.log('connection to mongodb, retries:', retries)
    return new Promise(async (resolve, reject) => {
      let i = 1;
      while(i < retries && !this.db) {
        console.log('trying to connect', i);
        i++;
        try {
          await this.connection_retry();  
        } catch (error) {
          console.log('error trying to connect to mongoDB. Attempt: ', i);
        } 
      }
      if (this.db) {
        resolve();
      } else {
        reject('error connecting DB');
      }
    });
  }

  async connection_retry () {
    return new Promise((resolve, reject) => {
      setTimeout(async() => {
        try {
          if (this.db) { return }
          console.log('mongo db url: ', url);
          this.client = await MongoClient.connect(url, { useNewUrlParser: true })
          this.db = this.client.db(databaseName)
          await this.db.createCollection(tableName)  
        } catch (error) {
          reject(error)
        }
        resolve();
      },2000);
    });
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
