var BaseAction = require('./base')
var Promise = require('rsvp').Promise
var inherits = require('util').inherits
var assign = require('assign')

module.exports = DeleteItemAction

inherits(DeleteItemAction, BaseAction)

function DeleteItemAction(Ctor, hash, range) {
  BaseAction.call(this)
  this.Ctor = Ctor
  this.hash = hash
  this.range = range
}

assign(DeleteItemAction.prototype, {

  params: function () {
    return {
      Key: this.Ctor.to(this.Ctor.key(this.hash, this.range)),
      TableName: this.Ctor.table
    }
  },

  _exec: function () {
    return new Promise(function (resolve, reject) {
      this.Ctor.service.deleteItem(this.params(), function (err, data) {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

})

