module.exports = transform

function transform(schema, method, data) {
  return Object.keys(attrs).reduce(function (memo, key) {
    if (schema[key]) {
      memo[key] = schema[key][method](attrs[key])
    }
    return memo
  }, {})
}
