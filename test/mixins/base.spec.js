var should = require('should')
var base = require('../../lib/mixins/base')
var string = require('../../lib/types/string')

var testAttrs = {
  id: 'a7043b9',
  name: 'Tobias'
}

// TODO: refactor tests for base mixin
xdescribe('The BaseModel constructor', function () {
  
  var instance

  beforeEach(function () {
    BaseModel.schema =  {
      id: string,
      name: string
    }
    BaseModel.hashKey = 'id'
    instance = new BaseModel(testAttrs)
  })

  afterEach(function () {
    delete BaseModel.schema
    delete BaseModel.hashKey
    delete BaseModel.rangeKey
  })

  describe('#markSaved()', function () {

    it('should set _savedAttribues equal to the current attrs', function () {
      instance.id = '47'
      should(instance._savedAttributes).not.eql(instance.attributes())
      instance.markSaved()
      instance._savedAttributes.should.eql(instance.attributes())
    })
    
  })

  describe('#isModified()', function () {
    
    it('should return true for all new instances', function () {
      instance.isModified().should.be.true
    })

    it('should return false after calling #markSaved', function () {
      instance.markSaved()
      instance.isModified().should.be.false
    })

    it('should return true if an attribute has changed', function () {
      instance.markSaved()
      instance.name = 'Buster'
      instance.isModified().should.be.true
    })

  })

  describe('#attributes()', function () {
    
    it('should only return attrs defined in schema', function () {
      instance.someRandomAttributeNotInSchema = 'foo'
      instance.attributes().should.eql(testAttrs)
    })

    it('should not return attributes in schema not on instance', function () {
      BaseModel.schema.someAdditionalAttributes = string
      instance.attributes().should.eql(testAttrs)
    })

  })

  describe('#setKeys()', function () {
    
    it('should set #_hashKey if the hashKey is set on instance', function () {
      instance.setKeys()
      instance._hash.should.equal(instance.id)
    })

    it('should set #_hashKey to null if hashKey is not set', function () {
      delete instance.id
      instance.setKeys()
      should(instance._hash).equal(null)
    })

    it('should set #_rangeKey if the rangeKey is set on instance', function () {
      BaseModel.rangeKey = 'name'
      instance.setKeys()
      instance._range.should.equal(instance.name)
    })

    it('should set #_rangeKey to null if rangeKey is not set', function () {
      instance.setKeys()
      should(instance._range).equal(null)
    })

  })
  
})

