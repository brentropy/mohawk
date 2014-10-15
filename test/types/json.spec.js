var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var stubs = {}
var json = proxyquire('../../lib/types/json', {'./string': stubs})

stubs.to = sinon.stub().returnsArg(0)
stubs.from = sinon.stub().returnsArg(0)

describe('The json attribute type', function () {

  beforeEach(function () {
    sinon.stub(JSON, 'stringify')
    sinon.stub(JSON, 'parse')
  })

  afterEach(function () {
    JSON.stringify.restore()
    JSON.parse.restore()
  })

  describe('`to()` method', function () {

    it('should call JSON.stringify with the value', function () {
      var val = 'foo'
      json.to(val)
      sinon.assert.calledWithExactly(JSON.stringify, val)
    })

    it('should return the result of JSON.stringify', function () {
      var expected = 'bar'
      JSON.stringify.returns(expected)
      json.to('foo').should.equal(expected)
    })

  })

  describe('`from()` method', function () {

    it('should call JSON.parse with the value', function () {
      var val = 'foo'
      json.from(val)
      sinon.assert.calledWithExactly(JSON.parse, val)
    })

    it('should return the result of JSON.parse', function () {
      var expected = 'bar'
      JSON.parse.returns(expected)
      json.from('foo').should.equal(expected)
    })
 
  })

})

