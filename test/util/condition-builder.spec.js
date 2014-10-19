var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var stubs = {'./array-expression': sinon.stub()}
var ConditionBuilder = proxyquire('../../lib/util/condition-builder', stubs)

describe('The ConditionBuilder util class', function () {
  
  var cond

  beforeEach(function () {
    cond = new ConditionBuilder()
    stubs['./array-expression'].reset()
  })

  describe('#toString() method', function () {
    
    it('should join the _conditions with _joinWith in parens', function () {
      cond._joinWith = 'b'
      cond._conditions = ['a', 'c']
      cond.toString().should.equal('(abc)')
    })

  })

  describe('#and() method', function () {
    
    it('should call #_subCondition with false as first argument', function () {
      sinon.spy(cond, '_subCondition')
      cond.and()
      sinon.assert.calledWith(cond._subCondition, false)
    })

    it('should call #_cubCondition with arguments as second arg', function () {
      sinon.spy(cond, 'and')
      sinon.stub(cond, '_subCondition').returns(cond)
      cond.and(['and'], ['or'])
      cond._subCondition.firstCall.args[1].should.eql(cond.and.firstCall.args)
    })

  })
 
  describe('#or() method', function () {
    
    it('should call #_subCondition with true as first argument', function () {
      sinon.spy(cond, '_subCondition')
      cond.or()
      sinon.assert.calledWith(cond._subCondition, true)
    })

    it('should call #_cubCondition with arguments as second arg', function () {
      sinon.spy(cond, 'or')
      sinon.stub(cond, '_subCondition').returns(cond)
      cond.or(['and'], ['or'])
      cond._subCondition.firstCall.args[1].should.eql(cond.or.firstCall.args)
    })

  }) 

  describe('#_subCondition() method', function () {
    
    it('should return this', function () {
      cond._subCondition(false, []).should.equal(cond)
    })

    it('should add a ConditionBuilder instance to _conditions', function () {
      cond._subCondition(false, [])
      cond._conditions[0].should.be.instanceOf(ConditionBuilder)
    })

    it('should set _joinWith to " and " if or is false', function () {
      cond._subCondition(false, [])
      cond._conditions[0]._joinWith.should.equal(' and ')
    })

    it('should set _joinWith to " or " if or is true', function () {
      cond._subCondition(true, [])
      cond._conditions[0]._joinWith.should.equal(' or ')
    })

    it('should call function arg with sub cond as context', function () {
      var spy = sinon.spy()
      cond._subCondition(false, [spy])
      sinon.assert.calledOn(spy, cond._conditions[0])
    })

    it('should call arrayExpression with sub cond and each arg', function () {
      var args = [['and'], ['or']]
      var spy = sinon.spy()
      var stub = sinon.stub(stubs['./array-expression'], 'bind').returns(spy)
      cond._subCondition(false, args)
      sinon.assert.calledWith(stub, null, cond._conditions[0])
      args.forEach(function (arg, i) {
        spy.args[i][0].should.eql(arg)
      })
    })

  })

})

