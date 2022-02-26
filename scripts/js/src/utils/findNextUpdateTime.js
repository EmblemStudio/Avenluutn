"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextUpdateTime = void 0;
/*
 * findNextUpdateTime returns the next time the script needs to be run or -1 if
 * it does not need to be run again
 *
 * It returns the lowest element in updateTimes that is greater than runStart or
 * -1 if all elements in updateTimes are lower than runStart
 */
function findNextUpdateTime(runStart, // the time the script was run (a more consistant "now")
updateTimes, // [scheduledStartTime, ...internalUpdateTimes]
allOutcomesSucceeded) {
    console.log(`called findNextUpdateTime(${runStart}, [${updateTimes}], ${allOutcomesSucceeded}`);
    updateTimes.sort();
    const endUpdateTime = updateTimes[updateTimes.length - 1];
    if (endUpdateTime === undefined) {
        // should only happen when updateTimes is empty
        console.log("undefined endUpdateTime returning -1");
        return -1;
    }
    if (endUpdateTime < runStart) {
        // run started after last update time, no more updates
        console.log(`endUpdateTime: ${endUpdateTime} < runStart ${runStart} returning -1`);
        return -1;
    }
    if (allOutcomesSucceeded !== false) { // why not === true?
        // if an outcome was failed, skip to the end update time
        console.log(`allOutcomesSucceeded ${allOutcomesSucceeded} is not false, returning endUpdateTime ${endUpdateTime}`);
        return endUpdateTime;
    }
    for (const t of updateTimes) {
        if (runStart < t) {
            // this run was before the update time
            // the first time this is entered should be the next update time
            console.log(`found update time (returning ${t}) after runStart (${runStart})`);
            return t;
        }
    }
    // if we haven't found it by now, don't update again
    // should be never
    console.log("WARNING: expected to find an update time. returning -1");
    return -1;
}
exports.findNextUpdateTime = findNextUpdateTime;
