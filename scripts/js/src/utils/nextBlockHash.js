"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundingBlocks = exports.closestEarlierBlockHash = exports.nextBlockHash = exports.makeProvider = void 0;
const ethers_1 = require("ethers");
function makeProvider(providerUrl) {
    if (providerUrl) {
        return new ethers_1.providers.JsonRpcProvider(providerUrl);
    }
    return ethers_1.providers.getDefaultProvider();
}
exports.makeProvider = makeProvider;
/**
 * If `time` has been reached, try to get closest earlier block
 */
// TODO consider renaming this to `blockHashAsOf` or `blockHashIfReady`
// TODO consider changing this to `getCheckpoint` which returns a unique
// Prando as well
async function nextBlockHash(time, provider) {
    const now = Math.floor(Date.now() / 1000);
    if (time > now) {
        console.warn(`Time ${time} is in the future.`);
        return null;
    }
    const startBlockHash = await closestEarlierBlockHash(time, provider);
    if (!startBlockHash) {
        console.warn(`Unreachable: no mined block found before time ${time}.`);
        return null;
    }
    return startBlockHash;
}
exports.nextBlockHash = nextBlockHash;
/**
 * Find closest block before the target time
 */
const cachedBlocks = new Map();
let latestBlockCache = undefined;
async function getLatestBlock(provider) {
    if (latestBlockCache === undefined) {
        latestBlockCache = await provider.getBlock("latest");
    }
    return latestBlockCache;
}
async function getBlock(blockNumber, provider) {
    if (blockNumber < 0) {
        return undefined;
    }
    if (!cachedBlocks.has(blockNumber)) {
        const maybeBlock = await provider.getBlock(blockNumber);
        if (maybeBlock === null) {
            // future block?
            return undefined;
        }
        cachedBlocks.set(blockNumber, maybeBlock);
    }
    const block = cachedBlocks.get(blockNumber);
    if (block === undefined) {
        console.warn("Expected cached block but didn't get one");
        return await provider.getBlock(blockNumber);
    }
    return block;
}
async function closestEarlierBlockHash(targetTime, provider) {
    const bounds = await boundingBlocks(targetTime, provider);
    if (bounds === null) {
        return null;
    }
    return bounds[0].hash;
}
exports.closestEarlierBlockHash = closestEarlierBlockHash;
function sleep(ms) {
    console.warn("sleeping", ms);
    return new Promise(resolve => setTimeout(resolve, ms));
}
function logBlockInfo(aName, bName, a, b, t) {
    if (a.number === b.number) {
        console.log(`${aName} and ${bName} are the same`);
    }
    else {
        console.log(`Blocks        ${aName}:${a.number} ${bName}:${b.number} TargetTime ${t}
${aName} - ${bName}
Number diff   ${a.number - b.number} blocks
Time diff     ${a.timestamp - b.timestamp} secs
${aName} off target  ${a.timestamp - t} secs
${bName} off target  ${b.timestamp - t} secs
`);
    }
}
// refineBounds returns the tightest upper and lower bounds available
let seenBlocks = [];
async function bestBounds(targetTime, blocks, provider) {
    seenBlocks = [...new Set([...seenBlocks, ...blocks])];
    // sort the blocks
    seenBlocks.sort((a, b) => a.timestamp - b.timestamp);
    // separate them into upper and lower blocks
    const lowerBlocks = seenBlocks.filter(b => b.timestamp <= targetTime);
    const upperBlocks = seenBlocks.filter(b => b.timestamp >= targetTime);
    // if one is empty we don't have good bounds
    if (lowerBlocks.length === 0 || upperBlocks.length === 0) {
        return null;
    }
    // best lower bound is the highest of the lower blocks
    const bestLower = lowerBlocks[lowerBlocks.length - 1];
    if (bestLower === undefined) {
        throw new Error("never?");
    }
    const bestUpper = upperBlocks[0];
    if (bestUpper === undefined) {
        throw new Error("never?");
    }
    return [bestLower, bestUpper];
}
async function estimateBlocks(targetTime, block, provider) {
    var _a;
    const latestBlock = await getLatestBlock(provider);
    if (latestBlock === undefined) {
        throw new Error("could not get latest block");
    }
    if (block === undefined) {
        block = latestBlock;
    }
    const diff = targetTime - block.timestamp;
    const jumpSize = Math.floor(diff / 13.3); // 13.3 average block time
    // guess one block in either direction, the jump size, and half the jump size
    const jumps = [1, -1, jumpSize, Math.floor(jumpSize / 2)];
    const likelyBlocks = [];
    for (let i in jumps) {
        const jump = (_a = jumps[i]) !== null && _a !== void 0 ? _a : 0;
        let guess = jump + block.number;
        if (guess < 1) {
            guess = 1;
        }
        if (guess > latestBlock.number) {
            guess = latestBlock.number;
        }
        const likelyBlock = await getBlock(guess, provider);
        if (likelyBlock === undefined) {
            throw new Error("likely block not found");
        }
        likelyBlocks.push(likelyBlock);
    }
    return likelyBlocks;
}
async function boundingBlocks(targetTime, provider, upperBound, lowerBound) {
    if (typeof provider === "string") {
        provider = makeProvider(provider);
    }
    // if they are undefined, start with block 1 and the latest block as bounds
    if (lowerBound === undefined) {
        lowerBound = await getBlock(1, provider);
        if (lowerBound === undefined) {
            throw new Error("Could not get block 1");
        }
        if (targetTime < lowerBound.timestamp) {
            console.warn("target time before block 1");
            return null;
        }
    }
    if (upperBound === undefined) {
        upperBound = await getLatestBlock(provider);
        if (targetTime > upperBound.timestamp) {
            console.warn("target time after latest block");
            return null;
        }
    }
    // are they bounding blocks?
    if (lowerBound !== undefined && upperBound !== undefined) { // type narrow
        // are they 1 or less away from each other?
        if (upperBound.number - lowerBound.number <= 1) {
            // are either of them spot on?
            if (lowerBound.timestamp === targetTime) {
                return [lowerBound, lowerBound];
            }
            if (upperBound.timestamp === targetTime) {
                return [upperBound, upperBound];
            }
            // are they reversed?
            if (upperBound.number < lowerBound.number) {
                throw new Error("Inverted upper and lower bounds");
            }
            // they are bounding blocks
            return [lowerBound, upperBound];
        }
    }
    else {
        // should not get here without upper and lower bounds
        // upper and lower bounds should have been established
        // at the start of the function
        throw new Error("Never");
    }
    // otherwise estimate new blocks for each
    const lowerEstimates = await estimateBlocks(targetTime, lowerBound, provider);
    const upperEstimates = await estimateBlocks(targetTime, upperBound, provider);
    const newBounds = await bestBounds(targetTime, [...lowerEstimates, ...upperEstimates], provider);
    if (newBounds === null) {
        console.warn("Could not refine bounds", upperBound.number, lowerBound.number);
        return null;
    }
    const [newLowerBound, newUpperBound] = newBounds;
    // recurse
    return boundingBlocks(targetTime, provider, newUpperBound, newLowerBound);
}
exports.boundingBlocks = boundingBlocks;
