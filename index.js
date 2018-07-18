const http = require('http');
const Router = require('./lib/router');
const Database = require('./lib/data/db');
const httpPort = process.env.WH_HTTP_PORT || 3010;

const router = new Router();
const server = http.createServer();

const database = new Database();

(async () => {
  await database.connect();
  console.log("Connected successfully to mongodb");
})();

server.on('request', async (req, res) => {
  try {
    const route = router.getRoute(req);
    req.database = database;
    const data = await route.send(req, res);
    res.write(typeof data === 'string' ? data : JSON.stringify(data));
  } catch(error) {
    res.writeHead(error.code || 500, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({data: error.message}));
  }
  res.end();
});

server.on('error', (error) => {
  console.error(err);
});

server.listen(httpPort, () => {
  console.log('webhook initialized and listening the port', httpPort);
});