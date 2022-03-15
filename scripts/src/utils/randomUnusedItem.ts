export function randomUnusedItem<T>(
  used: T[],
  randomItem: Function
): T {
  let item = randomItem()
  while (used.includes(item)) {
    item = randomItem()
  }
  return item
}