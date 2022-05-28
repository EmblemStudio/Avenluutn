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
const prando_1 = require("prando");
const startingState_1 = require("./startingState"); // use this if starting from a previous state
// does this break anything? it was throwing errors in browser
if (typeof window === 'undefined')
    globalThis.fetch = cross_fetch_1.fetch;
__exportStar(require("./utils/interfaces"), exports);
const chapter = "0.0.1";
async function tellStories(prevResult, startTime, length, totalStories, providerUrl) {
    const provider = (0, utils_1.makeProvider)(providerUrl);
    const runStart = Math.floor(Date.now() / 1000);
    const checkpoint = await (0, utils_1.newCheckpoint)(runStart, startTime, provider);
    let nextUpdateTime = startTime;
    console.log('prevResult', prevResult);
    if (checkpoint.error) {
        // TODO 
        const scriptResult = {
            stories: [],
            nextState: prevResult === null ? startingState_1.startingState : prevResult.nextState,
            nextUpdateTime: startTime
        };
        console.log('checkpoint error: returning', scriptResult);
        return scriptResult;
    }
    let state;
    if (prevResult === null) {
        state = startingState_1.startingState; // use this if starting from a previous state
        // state = await randomStartingState(totalStories, checkpoint.prng, provider) // use this if starting fresh
    }
    else {
        state = prevResult.nextState;
    }
    const stories = [];
    let events = [];
    for (let i = 0; i < totalStories; i++) {
        const story = await (0, tellStory_1.tellStory)(runStart, new prando_1.default(checkpoint.blockHash + `${i}`), state, startTime, length, i, provider);
        // if nextUpdateTime hasn't been updated yet OR this time is earlier
        if (nextUpdateTime === startTime || nextUpdateTime > story.nextUpdateTime) {
            nextUpdateTime = story.nextUpdateTime;
        }
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
