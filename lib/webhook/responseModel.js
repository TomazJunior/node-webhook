class ResponseModel {
  constructor (data) {
    this.id = data.id
    this.status = data.status || 'pending'
  }
}

module.exports = ResponseModel
