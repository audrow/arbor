import isEqual from './is-equal'

export function intersection<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => has(b, x)))
}

export function difference<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => !has(b, x)))
}

export function union<T>(a: Set<T>, b: Set<T>) {
  return new Set([
    ...intersection(a, b),
    ...difference(a, b),
    ...difference(b, a),
  ])
}

function has<T>(set: Set<T>, value: T) {
  return [...set].some((x) => isEqual(x, value))
}
