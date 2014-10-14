var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire').noPreserveCache()
var stubs = {}
var string = proxyquire('../../lib/types/string', {'./base': stubs})

stubs.to = function (val) { return val }
stubs.from = function (val) { return val }

describe('The string attribute type', function () {

  describe('`to()` method', function () {
    
    it('should return {S: \'\'} for any value without toString()', function () {
      string.to(null).should.eql({S: ''})
    })

    it('should return {S: [result of val.toString()]}', function () {
      var expected = {S: 'foo'}
      var val = {toString: sinon.stub().returns(expected.S)}
      string.to(val).should.eql(expected)
    })

  })

  describe('`from()` method', function () {
    
    it('should return val if it is not an object with S property', function () {
      var expected = 'foo'
      string.from(expected).should.equal(expected)
    }),

    it('should return the S prop for objects that have it', function () {
      var val = {S: 'foo'}
      string.from(val).should.equal(val.S)
    })

  })

})
