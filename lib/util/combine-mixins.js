var assign = require('assign')

module.exports = combineMixins

var mixableKeys = [
  'schema',
  'hooks',
  'statics',
  'instance'
]

function flatten(def) {
  var flat = []
  if (Array.isArray(def.mixins) && def.mixins.length > 0) {
    flat.concat(flatten(def.mixins))
  }
  flat.push(def)
}

function unique (defs) {
  return defs.reduce(function (memo, def) {
    if (memo.indexOf(def) === -1) {
      memo.push(def)
    }
  }, [])
}

function combine(keys, mixins) {
  var combined = {}
  keys.forEach(function (key) {
    var combinedKey = []
    mixins.forEach(function (mixin) {
      if (mixin[key]) {
        combinedKey.push(mixin[key])
      }
    })
    combined[key] = unique(combinedKey)
  })
  return combined
}

function combineMixins(def) {
  var mixins = unique(flatten(def))
  var combined = combine(mixableKeys, mixins)
  var combinedHooks = combine(combined.hooks, mixins)
  return assign(combinedHooks, combined)
}
