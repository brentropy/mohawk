var number = require('./number')

module.exports = number.extend({

  to: function (val) {
    if (val != null) {
      if (val instanceof Date === false) {
        val = new Date(val)
      }
      return val.getTime()
    }
    return null
  },

  from: function (val) {
    if (val === null) {
      return null
    }
    return new Date(val)
  }

})

