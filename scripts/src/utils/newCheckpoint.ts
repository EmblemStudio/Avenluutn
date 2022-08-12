import { BaseProvider, JsonRpcProvider, Provider, Block, getDefaultProvider } from '@ethersproject/providers'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from "@ethersproject/strings";
import Prando from 'prando';

export function makeProvider(providerUrl?: string): BaseProvider {
  if (providerUrl) { return new JsonRpcProvider(providerUrl) }
  return getDefaultProvider()
}

/**
 * If `time` has been reached, try to get closest earlier block
 */

interface Checkpoint {
  prng: Prando;
  blockHash: string;
  error?: Error;
}

export const checkPointErrors = {
  timeInFuture: `Time is in the future.`,
  unmined: `No mined block found before time--not mined yet?`
}

export async function newCheckpoint(
  runStart: number,
  checkpointTime: number,
  provider: BaseProvider,
  seed?: string
): Promise<Checkpoint> {
  console.log('finding checkpoint', { checkpointTime, seed, runStart })
  if (checkpointTime > runStart) {
    const error = new Error(checkPointErrors.timeInFuture)
    console.warn(error)
    return { error, prng: new Prando(-1), blockHash: "" }
  }

  const startBlockHash = await closestEarlierBlockHash(checkpointTime, provider)
  if (!startBlockHash) {
    const error = new Error(checkPointErrors.unmined)
    console.warn(error)
    return { error, prng: new Prando(-1), blockHash: "" }
  }
  return { prng: new Prando(startBlockHash + seed), blockHash: startBlockHash }
}


export async function nextBlockHash(
  time: number,
  provider: BaseProvider
): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  if (time > now) {
    console.warn(`Time ${time} is in the future.`)
    return null
  }

  const startBlockHash = await closestEarlierBlockHash(time, provider)

  if (!startBlockHash) {
    console.warn(`Unreachable: no mined block found before time ${time}.`)
    return null
  }

  return startBlockHash
}

/**
 * Find closest block before the target time
 */

const cachedBlocks: Map<number, Block> =
  new Map<number, Block>()


let latestBlockCache: Block | undefined = undefined
async function getLatestBlock(
  provider: Provider,
  refresh?: boolean
): Promise<Block> {
  if (latestBlockCache === undefined || refresh === true) {
    latestBlockCache = await provider.getBlock("latest")
  }
  return latestBlockCache
}

async function getBlock(
  blockNumber: number,
  provider: BaseProvider
): Promise<Block | undefined> {
  if (blockNumber < 0) {
    return undefined
  }
  if (!cachedBlocks.has(blockNumber)) {
    const maybeBlock = await provider.getBlock(blockNumber)
    if (maybeBlock === null) {
      // future block?
      return undefined
    }
    cachedBlocks.set(blockNumber, maybeBlock)
  }
  const block = cachedBlocks.get(blockNumber)
  if (block === undefined) {
    console.warn("Expected cached block but didn't get one")
    return await provider.getBlock(blockNumber)
  }
  return block
}

export async function closestEarlierBlockHash(
  targetTime: number,
  provider: BaseProvider | string,
): Promise<string | null> {
  if (targetTime > Date.now()) {
    return null
  }
  return keccak256(toUtf8Bytes(`${targetTime}`))
//  const bounds = await boundingBlocks(targetTime, provider)
//  if (bounds === null) {
//    return null
//  }
//  return bounds[0].hash
}

/*
function sleep(ms: number) {
  console.warn("sleeping", ms)
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logBlockInfo(aName: string, bName: string, a: Block, b: Block, t: number) {
  if (a.number === b.number) {
    console.log(`${aName} and ${bName} are the same`)
  } else {
    console.log(`Blocks        ${aName}:${a.number} ${bName}:${b.number} TargetTime ${t}
${aName} - ${bName}
Number diff   ${a.number - b.number} blocks
Time diff     ${a.timestamp - b.timestamp} secs
${aName} off target  ${a.timestamp - t} secs
${bName} off target  ${b.timestamp - t} secs
`)
  }
}
*/

// refineBounds returns the tightest upper and lower bounds available
let seenBlocks: Block[] = []
async function bestBounds(
  targetTime: number,
  blocks: Block[],
  provider: BaseProvider,
): Promise<[Block, Block] | null> {
  seenBlocks = [...new Set([...seenBlocks, ...blocks])]

  // sort the blocks
  seenBlocks.sort((a, b) => a.timestamp - b.timestamp)

  // separate them into upper and lower blocks
  const lowerBlocks = seenBlocks.filter(b => b.timestamp <= targetTime)
  const upperBlocks = seenBlocks.filter(b => b.timestamp >= targetTime)

  // if one is empty we don't have good bounds
  if (lowerBlocks.length === 0 || upperBlocks.length === 0) {
    return null
  }

  // best lower bound is the highest of the lower blocks
  const bestLower = lowerBlocks[lowerBlocks.length - 1]
  if (bestLower === undefined) { throw new Error("never?") }
  const bestUpper = upperBlocks[0]
  if (bestUpper === undefined) { throw new Error("never?") }

  return [bestLower, bestUpper]
}

async function estimateBlocks(
  targetTime: number,
  block: Block | undefined,
  provider: BaseProvider,
): Promise<Block[]> {
  const latestBlock = await getLatestBlock(provider)
  if (latestBlock === undefined) {
    throw new Error("could not get latest block")
  }
  if (block === undefined) {
    block = latestBlock
  }
  const diff = targetTime - block.timestamp
  const jumpSize = Math.floor(diff / 13.3) // 13.3 average block time
  // guess one block in either direction, the jump size, and half the jump size
  const jumps = [1, -1, jumpSize, Math.floor(jumpSize / 2)]
  const likelyBlocks: Block[] = []
  for (let i in jumps) {
    const jump = jumps[i] ?? 0
    let guess = jump + block.number
    if (guess < 1) {
      guess = 1
    }
    if (guess > latestBlock.number) {
      guess = latestBlock.number
    }
    const likelyBlock = await getBlock(guess, provider)
    if (likelyBlock === undefined) {
      throw new Error("likely block not found")
    }
    likelyBlocks.push(likelyBlock)
  }
  return likelyBlocks
}

export async function boundingBlocks(
  targetTime: number,
  provider: string | BaseProvider,
  timeout: number = Date.now() + 1000 * 60 * 10, // 10 minutes
  upperBound?: Block,
  lowerBound?: Block
): Promise<[Block, Block] | null> {
  if (typeof provider === "string") { provider = makeProvider(provider) }

  // if they are undefined, start with block 1 and the latest block as bounds
  if (lowerBound === undefined) {
    lowerBound = await getBlock(1, provider)
    if (lowerBound === undefined) {
      throw new Error("Could not get block 1")
    }
    if (targetTime < lowerBound.timestamp) {
      console.warn("target time before block 1")
      return null
    }
  }

  if (upperBound === undefined) {
    upperBound = await getLatestBlock(provider, true)
    if (targetTime > upperBound.timestamp) {
      console.warn(`target time ${targetTime} after latest block ${upperBound.timestamp}`)
      if (Date.now() >= timeout) {
        console.error(`boundingBlocks timed out after 10 minutes`)
        return null
      }
      await (new Promise(r => setTimeout(r, 1000 * 10))) // wait 10 seconds
      return boundingBlocks(targetTime, provider, timeout, undefined, lowerBound)
    }
  }

  // are they bounding blocks?
  if (lowerBound !== undefined && upperBound !== undefined) { // type narrow

    // are they 1 or less away from each other?
    if (upperBound.number - lowerBound.number <= 1) {
      // are either of them spot on?
      if (lowerBound.timestamp === targetTime) {
        return [lowerBound, lowerBound]
      }
      if (upperBound.timestamp === targetTime) {
        return [upperBound, upperBound]
      }

      // are they reversed?
      if (upperBound.number < lowerBound.number) {
        throw new Error("Inverted upper and lower bounds")
      }

      // they are bounding blocks
      return [lowerBound, upperBound]
    }
  } else {
    // should not get here without upper and lower bounds
    // upper and lower bounds should have been established
    // at the start of the function
    throw new Error("Never")
  }

  // otherwise estimate new blocks for each
  const lowerEstimates = await estimateBlocks(targetTime, lowerBound, provider)
  const upperEstimates = await estimateBlocks(targetTime, upperBound, provider)

  const newBounds = await bestBounds(
    targetTime,
    [...lowerEstimates, ...upperEstimates],
    provider,
  )
  if (newBounds === null) {
    console.warn("Could not refine bounds", upperBound.number, lowerBound.number)
    return null
  }
  const [newLowerBound, newUpperBound] = newBounds

  // recurse
  return boundingBlocks(targetTime, provider, timeout, newUpperBound, newLowerBound)
}
