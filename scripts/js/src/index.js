"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tellStories = void 0;
const prando_1 = require("prando");
const utils_1 = require("./utils");
const tellStory_1 = require("./tellStory");
const nextState_1 = require("./nextState");
const cross_fetch_1 = require("cross-fetch");
globalThis.fetch = cross_fetch_1.fetch;
async function tellStories(prevResult, startTime, length, totalStories, providerUrl) {
    console.log("telling", totalStories, "stories");
    const provider = (0, utils_1.makeProvider)(providerUrl);
    const startBlockHash = await (0, utils_1.nextBlockHash)(startTime, provider);
    if (!startBlockHash) {
        throw new Error('No starting block hash');
    }
    const prng = new prando_1.default(startBlockHash);
    let state;
    if (!prevResult) {
        state = await (0, utils_1.randomStartingState)(totalStories, prng, provider);
    }
    else {
        state = prevResult.nextState;
    }
    const stories = [];
    let events = [];
    for (let i = 0; i < totalStories; i++) {
        const story = await (0, tellStory_1.tellStory)(prng, state, startTime, length, i, provider);
        console.log("got story", story);
        stories.push(story);
        events = [...events, ...story.events];
    }
    const result = {
        stories,
        nextState: (0, nextState_1.nextState)(state, events)
    };
    return result;
}
exports.tellStories = tellStories;
async function checkOne() {
    return tellStories(null, 1637168603, 86400, 2, "http://localhost:8545");
}
(0, utils_1.boundingBlocks)(10, "http://localhost:8545").then((blocks) => {
    if (blocks === null) {
        console.log("no bounding blocks");
    }
    else {
        const [lower, upper] = blocks;
        console.log(upper);
        console.log(lower);
        console.log(upper.timestamp - lower.timestamp);
        console.log(upper.number - lower.number);
    }
}).catch(console.error);
