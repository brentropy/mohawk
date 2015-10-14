import {createHash} from 'crypto'
import {jsonToItem} from './json-to-item'
import {itemToJson} from './item-to-json'

const savedDigest = new WeakMap()

export default class BaseModel {
  static key (hash, range) {
    let jsonKey = {[this.hashKey]: hash}
    if (this.constructor.rangeKey) {
      jsonKey[this.constructor.rangeKey] = range
    }
    return jsonToItem(jsonKey)
  }

  static tableName () {
    return (this.prefix || '') + (this.table || this.name)
  }

  static fromItem (item) {
    let record = new this(itemToJson(item))
    record.freezeKey()
    savedDigest.set(record, record.digest())
    return record
  }

  static serviceCall (method, params) {
    return new Promise((resolve, reject) => {
      this.service[method](params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  static async find (hash, range) {
    let key = this.key(hash, range)
    let data = await this.serviceCall('getItem', {
      TableName: this.tableName(),
      Key: key
    })
    if (!data.Item) {
      return null
    }
    return this.fromItem(data.Item)
  }

  constructor (initial) {
    Object.assign(this, initial)
  }

  key () {
    let {hashKey, rangeKey} = this.constructor
    return this.constructor.key(this[hashKey], this[rangeKey])
  }

  freezeKey () {
    freezeProperty(this, this.constructor.hashKey)
    if (this.constructor.rangeKey) {
      freezeProperty(this, this.constructor.rangeKey)
    }
  }

  async save () {
    let digest = this.digest()
    if (digest === savedDigest.get(this)) {
      return false
    }
    await this.constructor.serviceCall('putItem', {
      TableName: this.constructor.tableName(),
      Item: jsonToItem(this)
    })
    this.freezeKey()
    savedDigest.set(this, digest)
    return true
  }

  async destroy () {
    await this.constructor.serviceCall('deleteItem', {
      TableName: this.constructor.tableName(),
      Key: this.key()
    })
    savedDigest.set(this, null)
  }

  digest () {
    return createHash('sha1')
      .update(JSON.stringify(jsonToItem(this)))
      .digest('base64')
  }
}

function freezeProperty (obj, prop) {
  Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: obj[prop]
  })
}
