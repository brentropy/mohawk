var BaseAction = require('./base')
var Promise = require('rsvp').Promise
var inherits = require('util').inherits
var assign = require('object-assign') 

module.exports = PutItemAction

inherits(PutItemAction, BaseAction)

function PutItemAction(instance) {
  BaseAction.call(this)
  this.instance = instance
  this.hash = hash
  this.range = range
}

assign(PutItemAction.prototype, {

  params: function () {
    return {
      Item: this.instance.constructor.to(this.attributes()),
      TableName: this.Ctor.table
    }
  },

  _exec: function () {
    return new Promise(function (resolve, reject) {
      var service = this.instance.constructor.service
      service.putItem(this.params(), function (err, data) {
        if (err) {
          return reject(err)
        }
        this.instance.setKeys().markSaved()
        resolve(this.instance)
      })
    })
  },

  safe: function () {
    // TODO: add condition to not overwrite existing key
    return this
  }

})

