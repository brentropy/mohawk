module.exports = arrayExpression

function arrayExpression(context, arr) {
  context[arr[0]].apply(context, arr.slice(1))
}
