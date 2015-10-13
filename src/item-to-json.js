const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

export function itemValueToJsonValue (itemValue) {
  let key = Object.keys(itemValue)[0]
  let val = itemValue[key]
  switch (key) {
    case 'N':
      if (/\./.test(val)) {
        return parseFloat(val)
      }
      return parseInt(val, 10)
    case 'S':
      if (DATE_PATTERN.test(val)) {
        return new Date(val)
      }
      return val
    case 'BOOL':
      return val
    case 'NULL':
      return null
    case 'L':
      return val.map(itemValueToJsonValue)
    case 'M':
      return itemToJson(val)
  }
}

export function itemToJson (item) {
  return Object.keys(item).reduce((memo, key) => {
    memo[key] = itemValueToJsonValue(item[key])
    return memo
  }, {})
}
