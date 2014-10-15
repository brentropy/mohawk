var assign = require('object-assign')
var only = require('only')
var eql = require('deep-eql')
var action = require('./action')

module.exports = BaseModel

function BaseModel(attrs, saved) {
  assign(this, attrs)
  this._savedAttrs = null
  this._hashKey = null
  this._rangeKey = null
}

/* Statics */

assign(BaseModel, {

  get: function (hash, range) {
    
  },

  query: function (hash, range) {
    
  },

  scan: function () {
    
  },

  delete: function (hash, range) {
    
  }

})

/* Instance */

assign(BaseModel.prototype, {

  markSaved: function () {
    this._savedAttributes = this.attributes()
  },

  isModified: function () {
    return !eql(this.attributes(), this._savedAttributes)
  },

  attributes: function () {
    var keys = Object.keys(this.constructor.schema)
    return only(this, keys)
  },

  setKeys: function () {
    this._hash = this[this.constructor.hashKey] || null
    this._range = this[this.constructor.rangeKey] || null
  },

  save: function () {
    
  },

  overwrite: function () {
    // perform a write instead of an update, will lose any attributes not
    // defined in schema
  }

})

