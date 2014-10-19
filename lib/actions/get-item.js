var BaseAction = require('./base')
var Promise = require('rsvp').Promise
var inherits = require('util').inherits
var assign = require('object-assign') 

module.exports = GetItemAction

inherits(GetItemAction, BaseAction)

function GetItemAction(Ctor, hash, range) {
  BaseAction.call(this)
  this.Ctor = Ctor
  this.hash = hash
  this.range = range
}

assign(GetItemAction.prototype, {

  params: function () {
    return {
      Key: this.Ctor.to(this.Ctor.key(this.hash, this.range)),
      TableName: this.Ctor.table,
      AttributesToGet: Object.keys(this.Ctor.schema)
    }
  },

  _exec: function () {
    return new Promise(function (resolve, reject) {
      this.Ctor.service.getItem(this.params(), function (err, data) {
        if (err) {
          return reject(err)
        }
        var attrs = this.Ctor.from(data.Item)
        var model = new this.Ctor(attrs).markSaved().setKeys()
        resolve(model)
      })
    })
  }

})

