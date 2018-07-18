const webhook = require('../webhook/webhook')
const ResponseModel = require('../webhook/responseModel')
const fs = require('fs')

module.exports = [
  {
    url: '/about',
    method: 'get',
    send: async (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/markdown'})
      return new Promise((resolve, reject) => {
        fs.readFile('README.md', 'utf8', (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
    }
  },
  {
    url: '/webhook',
    method: 'post',
    send: async (req, res) => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      const dbdata = await req.database.insert()
      const data = new ResponseModel({id: dbdata.insertedId})
      webhook.execute(req, data.id)
      return data
    }
  },
  {
    url: '/webhook/:id',
    method: 'get',
    send: async (req, res) => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      const id = req.url.split('/')[2]
      const data = await req.database.get(id)
      return data
    }
  },
  {
    url: '/webhook',
    method: 'get',
    send: async (req, res) => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      const data = await req.database.getAll()
      return data
    }
  }
]
