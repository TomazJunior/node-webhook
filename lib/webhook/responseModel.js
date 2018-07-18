class ResponseModel {
  constructor (data) {
    if (!data) { data = {} }
    this.id = data.id
    this.status = data.status || 'pending'
  }

  generateId () {
    const currDate = new Date()
    const maxNumber = 99999999
    return this.getRandomNumber(maxNumber).toString() + currDate.getTime().toString()
  }

  getRandomNumber (maxNumber) {
    return Math.floor(Math.random() * Math.floor(maxNumber))
  }
}

module.exports = ResponseModel
