const NotFoundException = require('../exceptions/notFoundException')
class Router {
  constructor (routes) {
    this.routes = routes
  };

  _parseUrl (url) {
    return url.split('/').filter((part) => {
      return !!part
    })
  };

  getRoute (req) {
    const reqUrlParsed = this._parseUrl(req.url)
    const route = this.routes.find((r) => {
      const urlParsed = this._parseUrl(r.url)
      return r.method === req.method.toLowerCase() &&
             urlParsed[0] === reqUrlParsed[0] &&
             urlParsed.length === reqUrlParsed.length
    })
    if (!route) {
      throw new NotFoundException(`[${req.method}] ${req.url} not found`)
    }
    return route
  };
}

module.exports = Router
