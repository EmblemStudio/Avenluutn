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
async function nextBlockHash(time, provider) {
    const now = Math.floor(Date.now() / 1000);
    if (time > now) {
        console.warn(`Time ${time} is in the future.`);
        return null;
    }
    console.log("getting start block hash", time, provider);
    const startBlockHash = await closestEarlierBlockHash(time, provider);
    console.log("got start block hash", startBlockHash);
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
async function getBlock(blockNumber, provider) {
    console.log("getBlock", blockNumber);
    if (!cachedBlocks.has(blockNumber)) {
        cachedBlocks.set(blockNumber, await provider.getBlock(blockNumber));
    }
    const block = cachedBlocks.get(blockNumber);
    if (block === undefined) {
        console.log("WARNING: expected cached block but didn't get one");
        return await provider.getBlock(blockNumber);
    }
    console.log("got block", block);
    return block;
}
/**
 * - if no block, set block to latest block
 * - find time difference between block.timestamp and targetTime
 * - if time difference is 0, return block's hash
 * - if previousBlock
 *   - if block and previous block "surround" targetTime && are 1 block apart, return the later block hash of block and previous block
 * - set newBlock using time difference
 * - if newBlock == block,
 *   - if block is earlier than target time, set newBlock to 1 block later
 *   - else, set newBlock to 1 block earlier
 * - recurse with block: newBlock, previousBlock: block
 */
async function closestEarlierBlockHash(targetTime, provider, block, previousBlock) {
    console.log("closestEarlierBlockHash", targetTime);
    if (block) {
        console.log("block number", block.number);
    }
    if (previousBlock) {
        console.log("previous block number", previousBlock.number);
    }
    if (typeof provider === "string") {
        provider = makeProvider(provider);
    }
    await provider.ready;
    if (!block) {
        block = await provider.getBlock("latest");
        if (targetTime >= block.timestamp) {
            console.warn(`Chain hasn't reached time ${targetTime} yet.`);
            return null;
        }
    }
    // Will be negative if block is EARLIER than target time
    const timeDifference = block.timestamp - targetTime;
    console.log("time difference", timeDifference);
    if (timeDifference === 0) {
        return block.hash;
    }
    // 13.3 = avg block time
    const blockNumber = Math.floor(block.number - (timeDifference / 13.3));
    let newBlock = await getBlock(blockNumber, provider);
    if (previousBlock) {
        if (surrounded(block.timestamp, previousBlock.timestamp, targetTime) &&
            Math.abs(block.number - previousBlock.number) === 1) {
            if (block.timestamp < previousBlock.timestamp) {
                return block.hash;
            }
            return previousBlock.hash;
        }
    }
    // if block is within 100 sec of target time, set new block 1 block toward target time
    if (Math.abs(block.timestamp - targetTime) <= 100) {
        console.log("marching", block.timestamp, block.number);
        if (block.timestamp < targetTime) {
            newBlock = await getBlock(block.number + 1, provider);
        }
        else {
            newBlock = await getBlock(block.number - 1, provider);
        }
    }
    /*
    // if newBlock is within 100 sec of target time and not 1 block away, set it to 1 block closer to the targetTime
    if (
      Math.abs(newBlock.timestamp - targetTime) <= 100 &&
      Math.abs(newBlock.number - block.number) !== 1
    ) {
      console.log(surrounded(newBlock.timestamp, block.timestamp, targetTime))
      if (newBlock.timestamp < targetTime) {
        newBlock = await provider.getBlock(newBlock.number + 1)
      } else {
        newBlock = await provider.getBlock(newBlock.number - 1)
      }
    }
    */
    return await closestEarlierBlockHash(targetTime, provider, newBlock, block);
}
exports.closestEarlierBlockHash = closestEarlierBlockHash;
function surrounded(time1, time2, surroundedTime) {
    if ((time1 > surroundedTime && time2 < surroundedTime) ||
        (time2 > surroundedTime && time1 < surroundedTime)) {
        return true;
    }
    return false;
}
// refine Bounds returns the tightest upper and lower bounds available
async function refineBounds(targetTime, estimates, provider, upperBound, lowerBound) {
    var _a, _b, _c, _d, _e, _f;
    const blocks = [upperBound, lowerBound, ...estimates];
    console.log("____");
    console.log("block diffs", blocks.map(b => {
        var _a;
        return ((_a = b === null || b === void 0 ? void 0 : b.timestamp) !== null && _a !== void 0 ? _a : Infinity) - targetTime;
    }));
    // check all blocks and track best bounds
    let newLowerBound = lowerBound;
    let newUpperBound = upperBound;
    const lowerTime = (_a = lowerBound === null || lowerBound === void 0 ? void 0 : lowerBound.timestamp) !== null && _a !== void 0 ? _a : -Infinity;
    const upperTime = (_b = upperBound === null || upperBound === void 0 ? void 0 : upperBound.timestamp) !== null && _b !== void 0 ? _b : Infinity;
    console.log("lower diff", lowerTime - targetTime);
    console.log("upper diff", upperTime - targetTime);
    blocks.forEach(b => {
        var _a;
        const t = (_a = b === null || b === void 0 ? void 0 : b.timestamp) !== null && _a !== void 0 ? _a : Infinity;
        // b is a better lower bound if it's > lower bound but <= target time
        if (t > lowerTime && t <= targetTime) {
            console.log("better lower bound", t - targetTime);
            newLowerBound = b;
        }
        // b is a better upper bound if its < upper bound but >= target time
        if (t < upperTime && t >= targetTime) {
            console.log("better upper bound", t - targetTime);
            newUpperBound = b;
        }
    });
    await new Promise(resolve => setTimeout(resolve, 100));
    if (newLowerBound !== undefined && lowerBound !== undefined) {
        if (newLowerBound.number === lowerBound.number) {
            console.log("lower bound didn't change, try one higher");
            newLowerBound = await getBlock(lowerBound.number + 1, provider);
            console.log("updated diff", ((_c = newLowerBound === null || newLowerBound === void 0 ? void 0 : newLowerBound.timestamp) !== null && _c !== void 0 ? _c : -Infinity) - targetTime);
            // if one more was too far, back off
            if (((_d = newLowerBound === null || newLowerBound === void 0 ? void 0 : newLowerBound.timestamp) !== null && _d !== void 0 ? _d : Infinity) > targetTime) {
                console.log("too far, go back");
                newLowerBound = lowerBound;
            }
        }
    }
    if (newUpperBound !== undefined && upperBound !== undefined) {
        if (newUpperBound.number === upperBound.number) {
            console.log("upper bound didn't change, try one lower");
            newUpperBound = await getBlock(upperBound.number - 1, provider);
            console.log("updated diff", ((_e = newUpperBound === null || newUpperBound === void 0 ? void 0 : newUpperBound.timestamp) !== null && _e !== void 0 ? _e : Infinity) - targetTime);
            // if one more was too far, back off
            if (((_f = newUpperBound === null || newUpperBound === void 0 ? void 0 : newUpperBound.timestamp) !== null && _f !== void 0 ? _f : -Infinity) < targetTime) {
                console.log("too far, go back");
                newUpperBound = upperBound;
            }
        }
    }
    return [newLowerBound, newUpperBound];
}
async function estimateBlock(targetTime, block, provider) {
    if (block === undefined) {
        block = await provider.getBlock("latest");
    }
    if (block === undefined) {
        throw new Error("could not get latest block");
    }
    const diff = targetTime - block.timestamp;
    const jumpSize = Math.floor(diff / 13.3); // 13.3 average block time
    return getBlock(block.number + jumpSize, provider);
}
async function boundingBlocks(targetTime, provider, upperBound, lowerBound) {
    if (typeof provider === "string") {
        provider = makeProvider(provider);
    }
    if (upperBound === undefined) {
        upperBound = await provider.getBlock("latest");
        if (targetTime > upperBound.timestamp) {
            return null;
        }
    }
    if (lowerBound === undefined) {
        lowerBound = await getBlock(1, provider);
        if (targetTime < lowerBound.timestamp) {
            return null;
        }
    }
    console.log("boundingBlocks", targetTime, upperBound.timestamp, lowerBound.timestamp);
    // are they bounding blocks?
    // do they have a difference of 1 or are they they the same?
    // they'll be the same if target time lands exactly on a block
    if (upperBound !== undefined && lowerBound !== undefined) {
        // type narrow ^
        if (upperBound.number - lowerBound.number <= 1) {
            // are either of them spot on?
            if (upperBound.timestamp === targetTime) {
                return [upperBound, upperBound];
            }
            if (lowerBound.timestamp === targetTime) {
                return [lowerBound, lowerBound];
            }
            return [lowerBound, upperBound];
        }
    }
    // otherwise estimate new blocks for each
    const estimates = [
        await estimateBlock(targetTime, upperBound, provider),
        await estimateBlock(targetTime, lowerBound, provider),
    ];
    console.log("estimates", estimates.map((e) => e.number));
    const [newLowerBound, newUpperBound] = await refineBounds(targetTime, estimates, provider, upperBound, lowerBound);
    // recurse
    return boundingBlocks(targetTime, provider, newUpperBound, newLowerBound);
}
exports.boundingBlocks = boundingBlocks;
