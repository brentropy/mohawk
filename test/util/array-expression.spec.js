var should = require('should')
var sinon = require('sinon')
var arrayExpression = require('../../lib/util/array-expression')

describe('The arrayExpression() util function', function () {
  
  it('should call method on context having key of arr[0]', function () {
    var arr = ['foo']
    var context = {foo: sinon.spy()}
    arrayExpression(context, arr)
    sinon.assert.called(context.foo)
  })

  it('should call method with args arr.slice(1)', function () {
    var arr = ['foo', 'bar', 'baz']
    var context = {foo: sinon.spy()}
    arrayExpression(context, arr)
    sinon.assert.calledWithExactly(context.foo, 'bar', 'baz')
  })

})
