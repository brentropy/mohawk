var only = require('only')
var eql = require('deep-eql')
var actions = require('../actions')
var transform = require('../util/transform')

module.exports = {
  
  statics: {

    get: function (hash, range) {
      return new actions.GetItem(this, this.key(hash, range))
    },

    query: function (hash, range) {
      
    },

    scan: function () {
      
    },

    delete: function (hash, range) {
      return new actions.DeleteItem(this, this.key(hash, range))
    },

    key: function (hash, range) {
      var key = {}
      key[this.hashKey] = hash
      if (this.rangeKey) {
        key[this.rangeKey] = range
      }
      return key
    },

    to: function (data) {
      return transform(this.schema, 'to', data)
    },

    from: function (data) {
      return transform(this.schema, 'from', data)
    }

  },

  instance: {

    markSaved: function () {
      this._savedAttributes = this.attributes()
      return this
    },

    isModified: function () {
      return !eql(this.attributes(), this._savedAttributes)
    },

    isNew: function () {
      return !this._hash
    },

    key: function () {
      return this.constructor.key(this._hash, this._range)
    },

    attributes: function () {
      var keys = Object.keys(this.constructor.schema)
      return only(this, keys)
    },

    setKeys: function () {
      this._hash = this[this.constructor.hashKey] || null
      this._range = this[this.constructor.rangeKey] || null
      return this
    },

    save: function () {
      if (this.isNew()) {
        return new actions.PutItem(this).safe()
      }
      return new actions.UpdateItem(this)
    },

    replace: function () {
      return new actions.PutItem(this)
    },

    delete: function () {
      return this.constructor.delete(this._hash, this._range)
    }

  }

}

