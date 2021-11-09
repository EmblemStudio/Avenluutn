"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closestEarlierBlockHash = exports.nextBlockHash = exports.makeProvider = void 0;
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
    if (typeof provider === "string") {
        provider = makeProvider(provider);
    }
    if (!block) {
        block = await provider.getBlock("latest");
        if (targetTime >= block.timestamp) {
            console.warn(`Chain hasn't reached time ${targetTime} yet.`);
            return null;
        }
    }
    // Will be negative if block is EARLIER than target time
    const timeDifference = block.timestamp - targetTime;
    if (timeDifference === 0) {
        return block.hash;
    }
    let newBlock = await provider.getBlock(Math.floor(block.number - (timeDifference / 13.3)) // 13.3 = avg block time
    );
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
        if (block.timestamp < targetTime) {
            newBlock = await provider.getBlock(block.number + 1);
        }
        else {
            newBlock = await provider.getBlock(block.number - 1);
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
