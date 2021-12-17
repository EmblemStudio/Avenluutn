"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextUpdateTime = void 0;
function findNextUpdateTime(updateTimes) {
    let now = Math.floor(Date.now() / 1000);
    let nextUpdateTime;
    let set = false;
    updateTimes.sort().reverse();
    updateTimes.forEach((t, i) => {
        if (t < now && set === false) {
            if (i === 0) {
                nextUpdateTime = -1;
            }
            else {
                nextUpdateTime = updateTimes[i - 1];
            }
            set = true;
        }
    });
    if (set === false)
        nextUpdateTime = updateTimes[updateTimes.length - 1];
    if (nextUpdateTime === undefined)
        return -1; // should be never
    return nextUpdateTime;
}
exports.findNextUpdateTime = findNextUpdateTime;
