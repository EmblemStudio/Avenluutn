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
        const story = await (0, tellStory_1.tellStory)(`${startBlockHash}{i}`, // prng,
        state, startTime, length, i, provider);
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
