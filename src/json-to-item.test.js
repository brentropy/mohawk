import test from 'tape'
import {jsonToItem} from './json-to-item'

let d = new Date()

test('jsonToItem()', t => {
  t.same(jsonToItem({a: 'b'}), {a: {S: 'b'}}, 'transforms strings')
  t.same(jsonToItem({a: 1}), {a: {N: '1'}}, 'transforms integers')
  t.same(jsonToItem({a: 1.1}), {a: {N: '1.1'}}, 'transforms floats')
  t.same(jsonToItem({a: true}), {a: {BOOL: true}}, 'transforms boolean true')
  t.same(jsonToItem({a: false}), {a: {BOOL: false}}, 'transforms boolena false')
  t.same(jsonToItem({a: null}), {a: {NULL: true}}, 'transforms null')
  t.same(jsonToItem({a: d}), {a: {S: d.toISOString()}}, 'transforms date')
  t.same(jsonToItem({a: [1]}), {a: {L: [{N: '1'}]}}, 'transforms arrays')
  t.same(jsonToItem({a: {b: 1}}), {a: {M: {b: {N: '1'}}}}, 'transforms objects')
  t.notOk(jsonToItem({a: /b/}).a, 'does not transform non-plain objects')
  t.end()
})
