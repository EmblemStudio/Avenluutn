"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closestEarlierBlockHash = exports.nextBlockHash = exports.makeProvider = void 0;
const ethers_1 = require("ethers");
const http = require("http");
function makeProvider(providerUrl) {
    console.log("making provider:", providerUrl);
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
const cachedBlocks = new Map();
async function getBlock(blockNumber, provider) {
    console.log("getting block", blockNumber);
    if (!cachedBlocks.has(blockNumber)) {
        console.log("block not cached", blockNumber);
        cachedBlocks.set(blockNumber, await provider.getBlock(blockNumber));
    }
    const block = cachedBlocks.get(blockNumber);
    if (block === undefined) {
        console.log("WARNING: expected cached block but didn't get one");
        return await provider.getBlock(blockNumber);
    }
    console.log("returning cached block");
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
    console.log("closestEarlierBlockHash", targetTime, block, provider);
    if (typeof provider === "string") {
        provider = makeProvider(provider);
    }
    console.log("ready? error?");
    provider._ready().then(console.log, console.error);
    console.log("getting localhost");
    http.get('http://localhost:8080', { timeout: 200 }, (res) => {
        const { statusCode } = res;
        console.log("localhost response!", statusCode);
    });
    setTimeout(async () => {
        const result = await ethers_1.utils.fetchJson("https://mainnet.infura.io/v3/46801402492348e480a7e18d9830eab8", '{ "id": 42, "jsonrpc": "2.0", "method": "eth_chainId", "params": [ ] }');
        console.log("fetch node address", result);
    }, 500);
    console.log("waiting for provider");
    await provider.ready;
    console.log("provider", provider);
    if (!block) {
        console.log("no block provided, getting the latest block");
        block = await provider.getBlock("latest");
        console.log("got latest block", block);
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
