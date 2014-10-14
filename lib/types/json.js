var string = require('./string')

module.exports = string.extend({
  to: function (val) {
    return JSON.stringify(val)
  },
  from: function (val) {
    return JSON.parse(val)
  }
})
