export function intersection<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => b.has(x)))
}

export function union<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a, ...b])
}

export function difference<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => !b.has(x)))
}
