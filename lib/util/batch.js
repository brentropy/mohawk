var assign = require('object-assign')
var RSVP = require('rsvp')
var Promise = RSVP.Promise

module.exports = Batch

function Batch() {
  this._index = -1
  this._actions = {}
  this._promises = {}
  this._resolvers = {}
}

assign(Batch.prototype, {

  add: function (action, name) {
    var key = name || ++this._index
    if (this._actions[key] && this._actions[key] !== action) {
      var err = new Error('Mohawk: Action was replaced with same name in batch')
      this.resolvers[key].reject(err)
    }
    this._actions[key] = action
    this._promises[key] = new Promise(function () {
      this._resolvers[key] = arguments
    })
    return this._promises[key]
  },

  exec: function () {
    // TODO: actually batch where possible
    var promises = {}
    Object.keys(this._actions).forEach(function (key) {
      promises[key] = this._actions[key]._exec
    })
    return RSVP.hash(promises).then(function (results) {
      Object.keys(results).forEach(function (key) {
        Promise.prototype.then.apply(this._promises[key], this._resolvers[key])
      })
      return results
    })
  }

})

