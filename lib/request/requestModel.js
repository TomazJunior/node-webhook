module.exports = class {
  constructor(data) {
    this.statusCode = data.res.statusCode;
    this.headers = data.res.headers;
    const contentType = this.headers["content-type"];
    this.body = this.parseBody(data.body, contentType);
  }

  parseBody(body, contentType) {
    if (contentType === 'application/json') {
      return JSON.parse(body);
    } else {
      return body;
    }
  }
}