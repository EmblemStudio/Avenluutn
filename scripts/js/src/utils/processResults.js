"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processResults = void 0;
function processResults(previousResults) {
    const processedResults = {};
    previousResults.forEach(result => {
        let advResults = processedResults[result.advId];
        if (advResults === undefined) {
            advResults = {
                "INJURY": [],
                "KNOCKOUT": [],
                "DEATH": [],
                "LOOT": [],
                "SKILL": [],
                "TRAIT": [],
            };
        }
        advResults[result.type].push(result);
        processedResults[result.advId] = advResults;
    });
    return processedResults;
}
exports.processResults = processResults;
