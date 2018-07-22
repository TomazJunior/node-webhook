# node-webhook [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard) [![Coverage Status](https://coveralls.io/repos/TomazJunior/node-webhook/badge.svg?branch=master)](https://coveralls.io/r/<TomazJunior/node-webhook?branch=master)

A simple webhook service, which will send a HTTP request based on the webhook's body and also store its result in mongodb.


## Getting Started

### With docker
```
docker-compose up
```
### Without docker
#### Prerequisites

- MongoDB https://docs.mongodb.com/manual/installation/
- NodeJS https://nodejs.org/en/

```
npm install
npm start
```

### API examples

The node-webhook is usefull if you need to track and log HTTP requests.

- GET /webhook Return all requests

- GET /webhook/{id} Return a specific request

- GET /about Return README.md content

- POST /webhook Handle the webhook and returns the request id
  - e.g.:
  
  ```
  header: Content-Type = Content-Type
  body : {
    "port": 443,
    "protocol": "https:",
    "host": "github.com",
    "path": "/TomazJunior/node-webhook"
  }
  response : {
    "id": "5b4fa8cd822fce0fb1102ecf",
    "status": "pending"
  }
  ```

## Running the tests

### StandardJS coding style tests

It uses StandardJS as javascript style guide

```
npm run std
```

## Author

* **Tomaz Junior** - [github](https://github.com/TomazJunior)

See also the list of [contributors](https://github.com/TomazJunior/node-webhook/contributors) who participated in this project.

## Next steps

- [ ] Implement unit tests
- [ ] Implement integration tests
- [x] Dockerize it
- [ ] Turn it into a node module

## Keywords
- Child Processes
- Requests
- MongoDB
- Async/Await

