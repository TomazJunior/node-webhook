const url = require('url')
const webhook = module.exports = {}
const { fork } = require('child_process')
const request = fork('./lib/request/request.js')
const Database = require('../data/db')

// TODO: refactor to be easier to test
request.on('message', async data => {
  const updateData = async (id, dataDb) => {
    const database = new Database()
    await database.connect()
    await database.update(id, dataDb)
    await database.close()
  }

  const response = data.response
  const body = data.body
  const id = data.id
  const headers = data.response.headers || {}
  if (response.statusCode === 301) {
    await updateData(id, { statusCode: response.statusCode, status: 'executing' })
    const location = headers.location
    if (location) {
      const parsedLocation = url.parse(location)
      body.protocol = parsedLocation.protocol
      body.host = parsedLocation.hostname
      body.path = parsedLocation.pathname
      request.send({body, id})
    }
  } else {
    await updateData(id, { statusCode: response.statusCode, status: 'done' })
    console.log('response done', id)
  }
})

webhook.execute = async (req, id) => {
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', async () => {
    body = Buffer.concat(body).toString()
    body = JSON.parse(body)
    request.send({body, id})
  })
}
