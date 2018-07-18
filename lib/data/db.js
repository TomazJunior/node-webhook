const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

//TODO: set external env
const databaseName = 'webhook';
const url = `mongodb://localhost:27017`;
const tableName = 'requests';

module.exports = class Database {
  constructor() {
    this.db = null;
  }
  
  async connect() {
    if (this.db) { return; }
    this.client = await MongoClient.connect(url, { useNewUrlParser: true });
    this.db = this.client.db(databaseName);
    await this.db.createCollection(tableName);
  }

  async close() {
    await this.client.close();
  }

  async update(_id, data) {
    var filter = { _id: ObjectId(_id) };
    var newvalues = { $set: {statusCode: data.statusCode, status: data.status } };
    const requests = this.db.collection(tableName);
    return await requests.updateOne(filter, newvalues);
  }

  async insert(request) {
    const requests = this.db.collection(tableName);
    return await requests.insertOne(request || {});
  }

  async get(_id) {
    const requests = this.db.collection(tableName);
    var filter = { _id: ObjectId(_id) };
    return await requests.findOne(filter);
  }

  async getAll() {
    const requests = this.db.collection(tableName);
    return await requests.find({}).toArray();
  }

}


