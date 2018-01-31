let Validator = require('koa-validate')
Validator.Validator.prototype.isString = function (tip) {
  if (this.goOn && typeof (this.value) !== 'string') this.addError(tip)
  return this
}
Validator.Validator.prototype.isStringArray = function (tip) {
  if (this.goOn && Object.prototype.toString.call(this.value) === '[object Array]') {
    for (let i of this.value) {
      if (typeof (i) !== 'string') {
        this.addError(tip)
      }
    }
  }
  if (this.goOn && Object.prototype.toString.call(this.value) !== '[object Array]') {
    this.addError(tip)
  }
  return this
}
Validator.Validator.prototype.isIntArray = function (tip) {
  if (this.goOn && Object.prototype.toString.call(this.value) === '[object Array]') {
    for (let i of this.value) {
      if (typeof (i) !== 'number') {
        this.addError(tip)
      }
    }
  }
  if (this.goOn && Object.prototype.toString.call(this.value) !== '[object Array]') {
    this.addError(tip)
  }
  return this
}
Validator.Validator.prototype.isArray = function (tip) {
  if (this.goOn && Object.prototype.toString.call(this.value) !== '[object Array]') {
    this.addError(tip)
  }
  return this
}
module.exports = Validator
