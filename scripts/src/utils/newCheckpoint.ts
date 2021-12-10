import { providers } from 'ethers'
import Prando from 'prando';

export function makeProvider(providerUrl?: string): providers.BaseProvider {
  if (providerUrl) { return new providers.JsonRpcProvider(providerUrl) }
  return providers.getDefaultProvider()
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
  unknown: `Unreachable: no mined block found before time.`
}

export async function newCheckpoint(
  time: number,
  provider: providers.BaseProvider,
  seed?: string
): Promise<Checkpoint> {
  const now = Math.floor(Date.now()/1000)
  if (time > now) {
    const error = new Error(checkPointErrors.timeInFuture)
    console.warn(error)
    return { error, prng: new Prando(-1), blockHash: "" }
  }

  const startBlockHash = await closestEarlierBlockHash(time, provider)
  if (!startBlockHash) {
    const error = new Error(checkPointErrors.unknown)
    console.warn(error)
    return { error, prng: new Prando(-1), blockHash: "" }
  }
  console.log(`Found checkpoint for time ${time}`)
  return { prng: new Prando(startBlockHash + seed), blockHash: startBlockHash }
}


export async function nextBlockHash(
  time: number,
  provider: providers.BaseProvider
): Promise<string | null> {
  const now = Math.floor(Date.now()/1000)
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

const cachedBlocks: Map<number, providers.Block> =
  new Map<number, providers.Block>()


let latestBlockCache: providers.Block | undefined = undefined
async function getLatestBlock(
  provider: providers.Provider
): Promise<providers.Block> {
  if (latestBlockCache === undefined) {
    latestBlockCache = await provider.getBlock("latest")
  }
  return latestBlockCache
}

async function getBlock(
  blockNumber: number,
  provider: providers.BaseProvider
): Promise<providers.Block | undefined> {
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
  provider: providers.BaseProvider | string,
): Promise<string | null> {
  const bounds = await boundingBlocks(targetTime, provider)
  if (bounds === null) {
    return null
  }
  return bounds[0].hash
}

function sleep(ms: number) {
  console.warn("sleeping", ms)
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logBlockInfo(aName: string, bName: string, a: providers.Block, b: providers.Block, t: number) {
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

// refineBounds returns the tightest upper and lower bounds available
let seenBlocks: providers.Block[] = []
async function bestBounds(
  targetTime: number,
  blocks: providers.Block[],
  provider: providers.BaseProvider,
): Promise<[providers.Block, providers.Block] | null> {
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
  const bestLower = lowerBlocks[lowerBlocks.length -1]
  if (bestLower === undefined) { throw new Error("never?") }
  const bestUpper = upperBlocks[0]
  if (bestUpper === undefined) { throw new Error("never?") }

  return [bestLower, bestUpper]
}

async function estimateBlocks(
  targetTime: number,
  block: providers.Block | undefined,
  provider: providers.BaseProvider,
): Promise<providers.Block[]> {
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
  const likelyBlocks: providers.Block[] = []
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
  provider: string | providers.BaseProvider,
  upperBound?: providers.Block,
  lowerBound?: providers.Block,
): Promise<[providers.Block, providers.Block] | null> {
  if (typeof provider === "string") { provider = makeProvider(provider)}

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
    upperBound = await getLatestBlock(provider)
    if (targetTime > upperBound.timestamp) {
      console.warn(`target time ${targetTime} after latest block`)
      return null
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
  return boundingBlocks(targetTime, provider, newUpperBound, newLowerBound)
}
