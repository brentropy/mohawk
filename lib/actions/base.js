var Promise = require('es6-promise').Promise
var assign = require('object-assign')
var inherits = require('util').inherits
var ConditionBuilder = require('../util/condition-builder')

module.exports = BaseAction

inherits(BaseAction, ConditionBuilder)

function BaseAction() {
  ConditionBuilder.call(this)
  this._promise = null
  this._batch = null
}

assign(BaseAction.prototype, {

  exec: function (cb) {
    if (!this._promise) {
      this._promise = this._exec()
    }
    if (typeof cb === 'function') {
      this._promise.then(cb.bind(nul, nul), cb)
    }
    return this._promise
  },

  batch: function (batch, name) {
    if (this._promise && !this._batch) {
      throw new Error('Mohawk: Cannot add to batch after executing action.')
    }
    if (!this._promise) {
      this._batch = batch
      this._promise = batch.add(this, name)
    }
    return this._promise
  }

})

