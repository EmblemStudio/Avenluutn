"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextUpdateTime = void 0;
function findNextUpdateTime(runStart, updateTimes, allOutcomesSucceeded) {
    let nextUpdateTime;
    let set = false;
    if (allOutcomesSucceeded !== false) {
        // if an outcome was failed, skip to the last update time
        nextUpdateTime = updateTimes[updateTimes.length - 1];
        set = true;
    }
    else {
        updateTimes.sort().reverse();
        updateTimes.forEach((t, i) => {
            if (t < runStart && set === false) {
                if (i === 0) {
                    nextUpdateTime = -1;
                }
                else {
                    nextUpdateTime = updateTimes[i - 1];
                }
                set = true;
            }
        });
    }
    if (set === false)
        nextUpdateTime = updateTimes[updateTimes.length - 1];
    if (nextUpdateTime === undefined)
        return -1; // should be never
    return nextUpdateTime;
}
exports.findNextUpdateTime = findNextUpdateTime;
