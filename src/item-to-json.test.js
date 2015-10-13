import test from 'tape'
import {itemToJson} from './item-to-json'

test('itemToJson()', t => {
  t.test('string', t => {
    t.same(itemToJson({a: {S: 'b'}}), {a: 'b'})
    t.end()
  })

  t.test('integer', t => {
    t.same(itemToJson({a: {N: '1'}}), {a: 1})
    t.end()
  })

  t.test('float', t => {
    t.same(itemToJson({a: {N: '1.1'}}), {a: 1.1})
    t.end()
  })

  t.test('boolean', t => {
    t.same(itemToJson({a: {BOOL: true}}), {a: true})
    t.same(itemToJson({a: {BOOL: false}}), {a: false})
    t.end()
  })

  t.test('null', t => {
    t.same(itemToJson({a: {NULL: true}}), {a: null})
    t.end()
  })

  t.test('date', t => {
    let d = new Date()
    t.equal(itemToJson({a: {S: d.toISOString()}}).a.getTime(), d.getTime())
    t.end()
  })

  t.test('array', t => {
    t.same(itemToJson({a: {L: [{N: '1'}]}}), {a: [1]})
    t.end()
  })

  t.test('object', t => {
    t.same(itemToJson({a: {M: {b: {N: '1'}}}}), {a: {b: 1}})
    t.end()
  })
})
