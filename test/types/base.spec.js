var should = require('should')
var sinon = require('sinon')
var base = require('../../lib/types/base')

describe('The base attribute type', function () {

  var def

  beforeEach(function () {
    def = {
      to: sinon.spy(),
      from: sinon.spy()
    }
  })

  describe('`extend()` method', function () {
    
    it('should throw if def does not have a to method', function () {
      var test = function () {base.extend({from: function () {}}) }
      test.should.throw()
    })

    it('should throw if def does not have a from method', function () {
      var test = function () {base.extend({to: function () {}}) }
      test.should.throw()
    })

    it('should return a new object', function () {
      var child = base.extend(def)
      child.should.not.equal(base)
    })

    it('should return a child with a different __typeId', function () {
      var child = base.extend(def)
      child.__typeId.should.not.equal(base.__typeId)
    })

    it('should append a number to parents __typeId', function () {
      var child = base.extend(def)
      child.__typeId.slice(0, -1).should.eql(base.__typeId)
    })

    it('should extend the parent meta with the child meta', function () {
      var parent = base.meta({a: 1, b: 2})
      def.meta = {b: 3, c: 4}
      child = parent.extend(def)
      child.meta.should.be.a.Function
      child.meta.should.have.property('a', 1)
      child.meta.should.have.property('b', 3)
      child.meta.should.have.property('c', 4)
    })

    it('should compose `to()` methods parent(child())', function () {
      var expected = {S: 'foo'}
      sinon.spy(base, 'to')
      def.to = sinon.stub().returns(expected)
      var child = base.extend(def)
      child.to()
      sinon.assert.calledWithExactly(base.to, expected)
      base.to.restore()
    })

    it('should compose `from()` methods child(parent())', function () {
      var expected = 'foo'
      sinon.stub(base, 'from').returns(expected)
      var child = base.extend(def)
      child.from()
      sinon.assert.calledWithExactly(def.from, expected)
      base.from.restore()
    })

  })

  describe('`to()` method', function () {
    
    it('should throw when called with a non-object', function () {
      !(function () { base.to(null) }).should.throw()
      !(function () { base.to('foo') }).should.throw()
      !(function () { base.to(123) }).should.throw()
    })

    it('should throw when val does not have one key', function () {
      !(function () { base.to({}) }).should.throw()
      !(function () { base.to({S: 'foo', N: 123}) }).should.throw()
    })

    it('should convert empty values to {NULL: true}', function () {
      var nullVal = {NULL: true}
      base.to({S: ''}).should.eql(nullVal)
      base.to({S: null}).should.eql(nullVal)
      base.to({SS: []}).should.eql(nullVal)
    })

    it('should return valid values unmodified', function () {
      var expected = {S: 'foo'}
      base.to(expected).should.equal(expected)
    })

  })

  describe('`from()` method', function () {

    it('should convert {NULL: true} values to null', function () {
      should(base.from({NULL: true})).equal(null)
    })
    
    it('should return non-null values unmodified', function () {
      var expected = {S: 'foo'}
      base.to(expected).should.equal(expected)
    })

  })

  describe('`meta()` method', function () {
    
    it('should return a new object', function () {
      var child = base.meta({})
      child.should.not.equal(base)
    })

    it('should return a child with the same __typeId', function () {
      var child = base.meta({})
      child.__typeId.should.equal(base.__typeId)
    })

    it('should extend the parent meta with the child meta', function () {
      var meta = base.meta({a: 1, b: 2})
      meta.meta.should.be.a.Function
      child.meta.should.have.property('a', 1)
      child.meta.should.have.property('b', 2)
    })

  })
  
  describe('`is()` method', function () {
    
    it('should return true when called with itself', function () {
      base.is(base).should.be.true
    })

    it('should return false when it is called with a non-type', function () {
      base.is({}).should.be.false
    })

    it('should return false when it is called with another type', function () {
      base.is(base.extend(def)).should.be.false
    })

  })

  describe('`childOf()` method', function () {
    
    it('should return false when called with itself', function () {
      base.childOf(base).should.be.false
    })

    it('should return false when it is called with a non-type', function () {
      base.childOf({}).should.be.false
    })

    it('should return true when it is called with a parent type', function () {
      var child = base.extend(def)

      child.childOf(base).should.be.true
    })

  })

})
