var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var stubs = {}
var date = proxyquire('../../lib/types/date', {'./number': stubs})

stubs.to = sinon.stub().returnsArg(0)
stubs.from = sinon.stub().returnsArg(0)

describe('The date attribute type', function () {

  describe('`to()` method', function () {

    it('should return null if val is null', function () {
      should(date.to(null)).equal(null)
    })

    it('should return the numeric time of the data', function () {
      var time = 47
      var val = new Date(47)
      date.to(val).should.equal(time)
    })

  })

  describe('`from()` method', function () {
    
    it('should return null if val is null', function () {
      should(date.from(null)).equal(null)
    }),

    it('should return a Date for numeric time', function () {
      var val = 47
      var res = date.from(val)
      res.should.be.a.Date
      res.getTime().should.equal(val)
    })

  })

})


