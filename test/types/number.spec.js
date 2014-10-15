var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire').noPreserveCache()
var stubs = {}
var number = proxyquire('../../lib/types/number', {'./base': stubs})

stubs.to = sinon.stub().returnsArg(0)
stubs.from = sinon.stub().returnsArg(0)

describe('The number attribute type', function () {

  describe('`to()` method', function () {

    it('should return {NULL: true} for non-number or NaN values', function () {
      var cases = [null, NaN, {}, 'foo', '']
      cases.forEach(function (test) {
        number.to(test).should.eql({NULL: true})
      })
    })

    it('should reutrn {N: [number string]} for number values', function () {
      var cases = [1, '1', -1, '-1', 1.23, '1.23', 0, '0']
      cases.forEach(function (test) {
        number.to(test).should.eql({N: test.toString()})
      })
    })

  })

  describe('`from()` method', function () {
    
    it('should return val if it is not an object with a N prop', function () {
      var expected = 'foo'
      number.from(expected).should.equal(expected)
    }),

    it('should return the N prop cast to a Number', function () {
      var val = {N: '47'}
      number.from(val).should.equal(Number(val.N))
    })

  })

})

