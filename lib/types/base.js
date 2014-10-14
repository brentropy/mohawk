var assign = require('object-assign')
var typeId = -1

module.exports = {
  __typeId: [++typeId],

  extend: function (def) {
    if (typeof def.to !== 'function' || typeof def.from !== 'function') {
      throw new Error('A mohawk type must have a to() and from() method')
    }
    var parent = this
    var child = assign({}, parent, {
      __typeId: parent.__typeId.concat(++typeId),
      to: function (val) {
        return parent.to(def.to(val))
      },
      from: function (val) {
        return def.from(parent.from(val))
      }
    })
    assign(child.meta, def.meta)
    return child
  },

  to: function (val) {
    // base to rules?
    return val
  },

  from: function (val) {
    // base from rules?
    return val
  },

  meta: function (data) {
    var child = assign({}, this)
    assign(child.meta, data)
    return child
  },

  is: function (type) {
    return this.__typeId === type.__typeId
  },

  childOf: function (type) {
    if (!Array.isArray(type.__typeId)) {
      return false
    }
    return this.__typeId.slice(0, -1).indexOf(type.__typeId.slice(-1)[0]) !== -1
  }
}

