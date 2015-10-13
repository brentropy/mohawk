import {createHash} from 'crypto'
import {jsonToItem} from './json-to-item'
import {itemToJson} from './item-to-json'

const savedDigest = new WeakMap()

export default class BaseModel {
  static key (hash, range) {
    let jsonKey = {[this.constructor.hashKey]: hash}
    if (this.constructor.rangeKey) {
      jsonKey[this.constructor.rangeKey] = range
    }
    return jsonToItem(jsonKey)
  }

  static tableName () {
    return (this.prefix || '') + (this.table || this.name)
  }

  static fromItem (item, saved = true) {
    let record = new this(itemToJson(item))
    if (saved) {
      savedDigest.set(record, record.digest())
    }
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
    return this.fromItem(data.Item || key, !!data.Item)
  }

  constructor (initial) {
    Object.assign(this, initial)
  }

  key () {
    let {hashKey, rangeKey} = this.constructor
    return this.constructor.key(this[hashKey], this[rangeKey])
  }

  async save () {
    let digest = this.digest()
    if (digest === savedDigest.get(this)) {
      return false
    }
    await this.constructor.serviceCall('putItem', {
      TableName: this.constructor.tableName(),
      Key: this.key(),
      Item: jsonToItem(this)
    })
    savedDigest.set(this, digest)
    return true
  }

  digest () {
    return createHash('sha1')
      .update(JSON.stringify(jsonToItem(this)))
      .digest('base64')
  }
}
