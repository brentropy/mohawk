var base = require('./base')

module.exports = base.extend({

  to: function (val) {
    try {
      return {S: val.toString()}
    } catch(e) {
      return {S: ''}
    }
  },
  
  from: function (val) {
    if (val === null || !val.S) {
      return val
    }
    return val.S
  }

})
