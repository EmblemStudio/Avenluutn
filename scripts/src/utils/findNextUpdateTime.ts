/*
 * findNextUpdateTime returns the next time the script needs to be run or -1 if
 * it does not need to be run again
 *
 * It returns the lowest element in updateTimes that is greater than runStart or
 * -1 if all elements in updateTimes are lower than runStart
 */
export function findNextUpdateTime(
  runStart: number, // the time the script was run (a more consistant "now")
  updateTimes: number[], // [scheduledStartTime, ...internalUpdateTimes]
  allOutcomesSucceeded: boolean
): number {
  updateTimes.sort()

  const endUpdateTime = updateTimes[updateTimes.length - 1]
  if (endUpdateTime === undefined) {
    // should only happen when updateTimes is empty
    console.log("WARNING: Unexpected undefined endUpdateTime")
    return -1
  }

  if (endUpdateTime < runStart) {
    // run started after last update time, no more updates
    return -1
  }

  if (!allOutcomesSucceeded) {
    // if an outcome was failed, skip to the end update time
    return endUpdateTime
  }

  for (const t of updateTimes) {
    if (runStart < t) {
      // this run was before the update time
      // the first time this is entered should be the next update time
      return t
    }
  }

  // if we haven't found it by now, don't update again
  // should be never
  console.log("WARNING: expected to find an update time. returning -1")
  return -1
}
