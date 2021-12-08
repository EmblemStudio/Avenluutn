"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tellStories = void 0;
// import Prando from 'prando'
const utils_1 = require("./utils");
const tellStory_1 = require("./tellStory");
const nextState_1 = require("./nextState");
const cross_fetch_1 = require("cross-fetch");
globalThis.fetch = cross_fetch_1.fetch;
__exportStar(require("./content/interfaces"), exports);
async function tellStories(prevResult, startTime, length, totalStories, providerUrl) {
    const provider = (0, utils_1.makeProvider)(providerUrl);
    const checkpoint = await (0, utils_1.newCheckpoint)(startTime, provider);
    if (checkpoint.error) {
        if (checkpoint.error.message === utils_1.checkPointErrors.timeInFuture) {
            return {
                stories: [],
                nextState: prevResult ? prevResult.nextState : { guilds: [] },
                nextUpdateTime: startTime
            };
        }
        return {
            stories: [],
            nextState: prevResult ? prevResult.nextState : { guilds: [] },
            nextUpdateTime: -1
        };
    }
    let state;
    if (!prevResult) {
        state = await (0, utils_1.randomStartingState)(totalStories, checkpoint.prng, provider);
    }
    else {
        state = prevResult.nextState;
    }
    const stories = [];
    let events = [];
    let nextUpdateTime = -1;
    for (let i = 0; i < totalStories; i++) {
        const story = await (0, tellStory_1.tellStory)(checkpoint.prng, state, startTime, length, i, provider);
        if (nextUpdateTime === -1 || nextUpdateTime > story.nextUpdateTime) {
            nextUpdateTime = story.nextUpdateTime;
        }
        console.log(`ran story guild ${i}. Current next update time: ${nextUpdateTime}`);
        // console.log("got story", story)
        stories.push(story);
        events = [...events, ...story.events];
    }
    const result = {
        stories,
        nextState: (0, nextState_1.nextState)(state, events),
        nextUpdateTime
    };
    return result;
}
exports.tellStories = tellStories;
