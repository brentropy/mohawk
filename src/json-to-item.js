export function jsonValueToItemValue (jsonValue) {
  switch (typeof jsonValue) {
    case 'string':
      return {S: jsonValue}
    case 'number':
      if (!isFinite(jsonValue)) {
        throw new Error('Infinity and NaN are not supported')
      }
      return {N: jsonValue.toString()}
    case 'boolean':
      return {BOOL: jsonValue}
    default:
      return jsonObjectValueToItemValue(jsonValue)
  }
}

export function jsonObjectValueToItemValue (jsonValue) {
  switch (true) {
    case jsonValue == null:
      return {NULL: true}
    case Array.isArray(jsonValue):
      return {L: jsonValue.map(jsonValueToItemValue)}
    case jsonValue instanceof Date:
      return {S: jsonValue.toISOString()}
    case jsonValue.constructor === Object:
      return {M: jsonToItem(jsonValue)}
  }
}

export function jsonToItem (json) {
  return Object.keys(json).reduce((memo, key) => {
    let val = jsonValueToItemValue(json[key])
    if (val) {
      memo[key] = val
    }
    return memo
  }, {})
}
