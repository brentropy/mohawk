var AWS = require('aws-sdk')
var assign = require('object-assign')
var base = require('./mixins/base')
var combineMixins = require('./util/combine-mixins')
var validateEnv = require('./util/validate-env')
var Batch = require('./util/batch')

var defaultService

module.exports = {

  apiVersion: '2012-08-10',

  createClass: function (def) {
    def.service = def.service || defaultService
    def.mixins = Array.isArray(def.mixins) ? def.mixins : []
    def.mixins.push(base)
    
    var combined = combineMixins(def)
    
    var Ctor = function () {
      assign(this, attrs)
      this._savedAttrs = null
      this._hashKey = null
      this._rangeKey = null
    }

    Ctor.table = def.table
    Ctor.hashKey = def.hashKey
    Ctor.rangeKey = def.rangeKey
    Ctor.service = def.service
    Ctor.hooks = combined.hooks
    Ctor.schema = {}

    assign.apply(null, [Ctor.schema].concat(combined.schema))
    assign.apply(null, [Ctor].concat(combined.statics))
    assign.apply(null, [Ctor.prototype].concat(combined.instance))

    return Ctor
  },

  createBatch: function () {
    return new Batch()
  },

  getService: function (conf) {
    return new AWS.DynamoDB({
      endpoint: conf.endpoint,
      region: conf.region,
      accessKeyId: conf.accessKeyId,
      secretAccessKey: conf.secretAccessKey,
      apiVersion: this.apiVersion
    })
  },

  setDefaultService: function (conf) {
    defaultService = this.getService(conf)
    return defaultService
  }

}

module.exports.setDefaultService({
  endpoint: process.env.DYNAMO_DB_ENDPOINT
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
