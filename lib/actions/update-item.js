var BaseAction = require('./base')
var Promise = require('rsvp').Promise
var inherits = require('util').inherits
var assign = require('object-assign') 

module.exports = UpdateItemAction

inherits(UpdateItemAction, BaseAction)

function UpdateItemAction(instance) {
  BaseAction.call(this)
  this.instance = instance
}

assign(UpdateItemAction.prototype, {

  params: function () {
    return {
      Item: this.instance.constructor.to(this.attributes()),
      TableName: this.Ctor.table
    }
  },

  _exec: function () {
    return new Promise(function (resolve, reject) {
      var service = this.instance.constructor.service
      service.updateItem(this.params(), function (err, data) {
        if (err) {
          return reject(err)
        }
        this.instance.setKeys().markSaved()
        resolve(this.instance)
      })
    })
  }

})

