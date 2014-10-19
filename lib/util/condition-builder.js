var assign = require('object-assign')
var format = require('util').format
var arrayExpression = require('./array-expression')

var COMPARISON_OPERATORS = ['=', '<>', '<', '<=', '>', '>=']

module.exports = ConditionBuilder

function ConditionBuilder(or, root) {
  this._joinWith = or ? ' or ' : ' and '
  this._root = root || this
  this._conditions = []
  this._attributeIndex = -1
  this._attributeNames = {}
  this._attributeValues = {}
}

assign(ConditionBuilder.prototype, {

  toString: function () {
    return format('(%s)', this._conditions.join(this._joinWith))
  },

  and: function () {
    return this._subCondition(false, arguments)
  },

  or: function () {
    return this._subCondition(true, arguments)
  },

  compare: function (name, operator, value) {
    if (COMPARISON_OPERATORS.indexOf(operator) === -1) {
      throw new Error('Mohawk: Invalid comparison operator')
    }
    var attr = this._getAttribute(name, value)
    this._conditions.push(format('%s %s %s', name, operator, attr))
    return this
  },

  between: function (name, value1, value2) {
    var attr1 = this._getAttribute(value1)
    var attr2 = this._getAttribute(value2)
    this._conditions.push(format('%s between %s and %s', name, attr1, attr2))
    return this
  },

  in: function (name, values) {
    var attrs = values.map(this._getAttribute.bind(this, name))
    this._conditions.push(format('%s in (%s)', name, attrs.join(', ')))
    return this
  },

  attributeExists: function (name) {
    this._conditions.push(format('attribute_exists (%s)', name))
    return this
  },

  attributeNotExists: function (name) {
    this._conditions.push(format('attribute__not_exists (%s)', name))
    return this
  },

  beginswith: function (name, value) {
    var attr = this._getAttribute(name, value)
    this._conditions.push(format('begins_with (%s, %s)', name, attr))
    return this
  },

  contains: function (name, value) {
    var attr = this._getAttribute(name, value)
    this._conditions.push(format('begins_with (%s, %s)', name, attr))
    return this
  },

  _subCondition: function (or, args) {
    args = Array.prototype.slice.call(args, 0)
    var sub = new ConditionBuilder(or, this)
    this._conditions.push(sub)
    if (typeof args[0] === 'function') {
      args[0].call(sub)
    } else {
      args.forEach(arrayExpression.bind(null, sub))
    }
    return this
  },

  _getAttribute: function (name, value) {
    var key = ':a' + ++this._root._attributeIndex
    this._root._attributeNames[key] = name
    this._root._attributeValues[key] = value
    return key
  }

})

COMPARISON_OPERATORS.forEach(function (operator) {
  ConditionBuilder.prototype[operator] = function (name, value) {
    this.compare(name, operator, value)
  }
})

