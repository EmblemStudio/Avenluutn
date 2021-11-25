import { providers, utils } from 'ethers'

export function makeProvider(providerUrl?: string): providers.BaseProvider {
  if (providerUrl) { return new providers.JsonRpcProvider(providerUrl) }
  return providers.getDefaultProvider()
}

/**
 * If `time` has been reached, try to get closest earlier block
 */

export async function nextBlockHash(
  time: number,
  provider: providers.BaseProvider
): Promise<string | null> {
  const now = Math.floor(Date.now()/1000)
  if (time > now) {
    console.warn(`Time ${time} is in the future.`)
    return null
  }
  console.log("getting start block hash", time, provider)
  const startBlockHash = await closestEarlierBlockHash(time, provider)
  console.log("got start block hash", startBlockHash)
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
    console.log("WARNING: expected cached block but didn't get one")
    return await provider.getBlock(blockNumber)
  }
  return block
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
export async function closestEarlierBlockHash(
  targetTime: number,
  provider: providers.BaseProvider | string,
  block?: providers.Block,
  previousBlock?: providers.Block
): Promise<string | null> {
  console.log("closestEarlierBlockHash", targetTime)
  if (block) { console.log("block number", block.number) }
  if (previousBlock) { console.log("previous block number", previousBlock.number) }
  if (typeof provider === "string") { provider = makeProvider(provider)}

  await provider.ready

  if (!block) {
    block = await getLatestBlock(provider)
    if (targetTime >= block.timestamp) {
      console.warn(`Chain hasn't reached time ${targetTime} yet.`)
      return null
    }
  }

  // Will be negative if block is EARLIER than target time
  const timeDifference = block.timestamp - targetTime
  console.log("time difference", timeDifference)
  if (timeDifference === 0) {
    return block.hash
  }

  // 13.3 = avg block time
  const blockNumber = Math.floor(block.number - (timeDifference / 13.3))
  let newBlock = await getBlock(blockNumber, provider)

  if (previousBlock) {
    if (
      surrounded(block.timestamp, previousBlock.timestamp, targetTime) &&
      Math.abs(block.number - previousBlock.number) === 1
    ) {
      if (block.timestamp < previousBlock.timestamp) {
        return block.hash
      }
      return previousBlock.hash
    }
  }

  // if block is within 100 sec of target time, set new block 1 block toward target time
  if (Math.abs(block.timestamp - targetTime) <= 100) {
    console.log("marching", block.timestamp, block.number)
    if (block.timestamp < targetTime) {
      newBlock = await getBlock(block.number + 1, provider)
    } else {
      newBlock = await getBlock(block.number - 1, provider)
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

  return await closestEarlierBlockHash(targetTime, provider, newBlock, block)
}

function surrounded(time1: number, time2: number, surroundedTime: number): boolean {
  if (
    (time1 > surroundedTime && time2 < surroundedTime) ||
    (time2 > surroundedTime && time1 < surroundedTime)
  ) {
    return true
  }
  return false
}

// refine Bounds returns the tightest upper and lower bounds available
async function refineBounds(
  targetTime: number,
  estimates: providers.Block[],
  provider: providers.BaseProvider,
  upperBound?: providers.Block,
  lowerBound?: providers.Block,
): Promise<[providers.Block | undefined, providers.Block | undefined]> {
  const blocks = [upperBound, lowerBound, ...estimates]

  // check all blocks and track best bounds
  let newLowerBound = lowerBound
  let newUpperBound = upperBound
  const lowerTime = lowerBound?.timestamp ?? -Infinity
  const upperTime = upperBound?.timestamp ?? Infinity
  blocks.forEach(b => {
    const t = b?.timestamp ?? Infinity

    // b is a better lower bound if it's > lower bound but <= target time
    if (t > lowerTime && t <= targetTime) {
      newLowerBound = b
    }

    // b is a better upper bound if its < upper bound but >= target time
    if (t < upperTime && t >= targetTime) {
      newUpperBound = b
    }
  })

  await new Promise(resolve => setTimeout(resolve, 100))

  if (newLowerBound !== undefined && lowerBound !== undefined) {
    if (newLowerBound.number === lowerBound.number) {
      newLowerBound = await getBlock(lowerBound.number + 1, provider)
      // if one more was too far, back off
      if ((newLowerBound?.timestamp ?? Infinity) > targetTime) {
        newLowerBound = lowerBound
      }
    }
  }

  if (newUpperBound !== undefined && upperBound !== undefined) {
    if (newUpperBound.number === upperBound.number) {
      newUpperBound = await getBlock(upperBound.number - 1, provider)
      // if one more was too far, back off
      if ((newUpperBound?.timestamp ?? -Infinity) < targetTime) {
        newUpperBound = upperBound
      }
    }
  }

  return [newLowerBound, newUpperBound]
}

async function estimateBlock(
  targetTime: number,
  block: providers.Block | undefined,
  provider: providers.BaseProvider,
): Promise<providers.Block> {
  const latestBlock = await getLatestBlock(provider)
  if (latestBlock === undefined) {
    throw new Error("could not get latest block")
  }
  if (block === undefined) {
    block = latestBlock
  }
  const diff = targetTime - block.timestamp
  const jumpSize = Math.floor(diff / 13.3) // 13.3 average block time
  let guess = jumpSize + block.number
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
  return likelyBlock
}

export async function boundingBlocks(
  targetTime: number,
  provider: string | providers.BaseProvider,
  upperBound?: providers.Block,
  lowerBound?: providers.Block,
): Promise<[providers.Block, providers.Block] | null> {
  if (typeof provider === "string") { provider = makeProvider(provider)}

  if (upperBound === undefined) {
    upperBound = await getLatestBlock(provider)
    if (targetTime > upperBound.timestamp) {
      return null
    }
  }

  if (lowerBound === undefined) {
    lowerBound = await getBlock(1, provider)
    if (lowerBound === undefined) {
      throw new Error("Could not get block 1")
    }
    if (targetTime < lowerBound.timestamp) {
      return null
    }
  }

  // are they bounding blocks?
  // do they have a difference of 1 or are they they the same?
  // they'll be the same if target time lands exactly on a block
  if (upperBound !== undefined && lowerBound !== undefined) {
    // type narrow ^
    if (upperBound.number - lowerBound.number <= 1) {
      // are either of them spot on?
      if (upperBound.timestamp === targetTime) {
        return [upperBound, upperBound]
      }
      if (lowerBound.timestamp === targetTime) {
        return [lowerBound, lowerBound]
      }
      return [lowerBound, upperBound]
    }
  }

  // otherwise estimate new blocks for each
  const estimates = [
    await estimateBlock(targetTime, upperBound, provider),
    await estimateBlock(targetTime, lowerBound, provider),
  ]

  const [newLowerBound, newUpperBound] = await refineBounds(
    targetTime,
    estimates,
    provider,
    upperBound,
    lowerBound,
  )

  // recurse
  return boundingBlocks(targetTime, provider, newUpperBound, newLowerBound)
}
