import {difference, intersection, union} from './sets'

describe('union', () => {
  it('should work with sets of literals', () => {
    expect(union(new Set([1, 2, 3]), new Set([2, 3, 4]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(union(new Set([2, 3]), new Set([2, 3]))).toEqual(new Set([2, 3]))
    expect(union(new Set([2]), new Set([3]))).toEqual(new Set([2, 3]))
    expect(union(new Set([1]), new Set([2, 3, 4]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
  })
  it('should work with objects', () => {
    expect(union(new Set([{a: 1}, {a: 2}]), new Set([{a: 2}, {a: 3}]))).toEqual(
      new Set([{a: 1}, {a: 2}, {a: 3}]),
    )
  })
  it('should work with empty sets', () => {
    expect(union(new Set([]), new Set([1, 2, 3, 4]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(union(new Set([1, 2, 3, 4]), new Set([]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(union(new Set([]), new Set([]))).toEqual(new Set([]))
  })
})

describe('difference', () => {
  it('should work with sets with literals', () => {
    expect(difference(new Set([1, 2, 3]), new Set([2, 3, 4]))).toEqual(
      new Set([1]),
    )
    expect(difference(new Set([1, 2, 3]), new Set([3, 4]))).toEqual(
      new Set([1, 2]),
    )
    expect(difference(new Set([1, 2, 3]), new Set([1, 2, 3]))).toEqual(
      new Set([]),
    )
    expect(difference(new Set([1, 2, 3]), new Set([1, 2, 3, 4]))).toEqual(
      new Set([]),
    )
  })
  it('should work with sets of objects', () => {
    expect(
      difference(
        new Set([{a: 1}, {a: 2}, {a: 3}]),
        new Set([{a: 2}, {a: 3}, {a: 4}]),
      ),
    ).toEqual(new Set([{a: 1}]))
  })
  it('should work with empty sets', () => {
    expect(difference(new Set([1, 2, 3, 4]), new Set([]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(difference(new Set([]), new Set([1, 2, 3, 4]))).toEqual(new Set([]))
    expect(difference(new Set([]), new Set([]))).toEqual(new Set([]))
  })
})

describe('intersection', () => {
  it('should work with sets of literals', () => {
    expect(intersection(new Set([1, 2, 3]), new Set([2, 3, 4]))).toEqual(
      new Set([2, 3]),
    )
    expect(intersection(new Set([1, 2, 3]), new Set([3, 4]))).toEqual(
      new Set([3]),
    )
    expect(intersection(new Set([1, 2, 3]), new Set([1, 2, 3]))).toEqual(
      new Set([1, 2, 3]),
    )
    expect(intersection(new Set([1, 2, 3]), new Set([1, 2, 3, 4]))).toEqual(
      new Set([1, 2, 3]),
    )
  })
  it('should work with sets of objects', () => {
    expect(
      intersection(
        new Set([{a: 1}, {a: 2}, {a: 3}]),
        new Set([{a: 2}, {a: 3}, {a: 4}]),
      ),
    ).toEqual(new Set([{a: 2}, {a: 3}]))
  })
  it('should work with empty sets', () => {
    expect(intersection(new Set([1, 2, 3, 4]), new Set([]))).toEqual(
      new Set([]),
    )
    expect(intersection(new Set([]), new Set([1, 2, 3, 4]))).toEqual(
      new Set([]),
    )
    expect(intersection(new Set([]), new Set([]))).toEqual(new Set([]))
  })
})
