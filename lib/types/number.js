var base = require('./base')

module.exports = base.extend({

  to: function (val) {
    var num = Number(val)
    if (num !== num || val === null || val === '') {
      return {NULL: true}
    }
    return {N: num.toString()}
  },
  
  from: function (val) {
    if (val === null || !val.N) {
      return val
    }
    return Number(val.N)
  }

})

