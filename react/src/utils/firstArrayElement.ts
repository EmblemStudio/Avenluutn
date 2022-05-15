export function firstArrayElement<T>(a: T[]): T {
  const first = a[0]
  if (first === undefined) throw new Error('could not find first array element: is array empty?')
  return first
}