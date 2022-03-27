import isEqual from './is-equal'

describe('isEqual', () => {
  it('should work for literal types', () => {
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual('a', 'a')).toBe(true)
    expect(isEqual(true, true)).toBe(true)
    expect(isEqual(false, false)).toBe(true)
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, undefined)).toBe(true)
  })
  it('should work for objects', () => {
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual({a: 1}, {a: 1})).toBe(true)
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true)
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 3})).toBe(false)
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 2, c: 3})).toBe(false)
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 3, c: 3})).toBe(false)
  })
  it('should work for nested objects', () => {
    expect(isEqual({a: {b: 1}}, {a: {b: 1}})).toBe(true)
    expect(isEqual({a: {b: 1}}, {a: {b: 2}})).toBe(false)
    expect(isEqual({a: {b: 1}}, {a: {b: 1, c: 2}})).toBe(false)
    expect(isEqual({a: {b: 1}}, {a: {b: 1, c: 2}})).toBe(false)
  })
})
