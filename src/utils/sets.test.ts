import {difference, intersection, union} from './sets'

describe('union', () => {
  it('works with various sets', () => {
    expect(union(new Set([1, 2, 3]), new Set([2, 3, 4]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(union(new Set([2, 3]), new Set([2, 3]))).toEqual(new Set([2, 3]))
    expect(union(new Set([2]), new Set([3]))).toEqual(new Set([2, 3]))
    expect(union(new Set([1]), new Set([2, 3, 4]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
  })
  it('works with empty sets', () => {
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
  it('works with sets with various values', () => {
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
  it('works with empty sets', () => {
    expect(difference(new Set([1, 2, 3, 4]), new Set([]))).toEqual(
      new Set([1, 2, 3, 4]),
    )
    expect(difference(new Set([]), new Set([1, 2, 3, 4]))).toEqual(new Set([]))
    expect(difference(new Set([]), new Set([]))).toEqual(new Set([]))
  })
})

describe('intersection', () => {
  it('works with sets with various values', () => {
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
  it('works with empty sets', () => {
    expect(intersection(new Set([1, 2, 3, 4]), new Set([]))).toEqual(
      new Set([]),
    )
    expect(intersection(new Set([]), new Set([1, 2, 3, 4]))).toEqual(
      new Set([]),
    )
    expect(intersection(new Set([]), new Set([]))).toEqual(new Set([]))
  })
})
