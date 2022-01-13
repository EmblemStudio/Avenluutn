export function findNextUpdateTime(runStart: number, updateTimes: number[]): number {
  // let now = Math.floor(Date.now()/1000)
  let nextUpdateTime
  let set: boolean = false
  updateTimes.sort().reverse()
  updateTimes.forEach((t, i) => {
    if (t < runStart && set === false) {
      if (i === 0) {
        nextUpdateTime = -1
      } else {
        nextUpdateTime = updateTimes[i - 1]
      }
      set = true
    }
  })
  if (set === false) nextUpdateTime = updateTimes[updateTimes.length - 1]
  if (nextUpdateTime === undefined) return -1 // should be never
  return nextUpdateTime
}