export function getTimeLeft(to: number): number {
  let newTimeLeft = to - Math.floor(Date.now()/1000)
  if (newTimeLeft < 0) return 0
  return newTimeLeft
}