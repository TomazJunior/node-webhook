const http = require('http')
const https = require('https')
const RequestModel = require('./requestModel')

// TODO: refactor to be easier to test
process.on('message', async (data) => {
  const response = await request(data.body)
  process.send({
    id: data.id,
    body: data.body,
    response
  })
})

async function request (options) {
  const promise = await new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http
    const req = protocol.request(options, (res) => {
      let body = []
      res.on('data', (chunk) => {
        body.push(chunk)
      }).on('end', () => {
        body = Buffer.concat(body).toString()
        resolve(new RequestModel({ body, res }))
      }).on('error', (error) => {
        console.log('error executing request', error)
        reject(error)
      })
    })
    req.end()
  })
  return promise
}
