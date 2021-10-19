import { providers } from 'ethers'
import Prando from 'prando'

export function makeProvider(providerUrl?: string): providers.BaseProvider {
  if (providerUrl) { return new providers.JsonRpcProvider(providerUrl) }
  return providers.getDefaultProvider()
}

export function makeParty(
  prng: Prando,
  size: number,
  adventurersLeft: string[]
): { party: number[], adventurersLeft: string[] } {
  const party: number[] = []
  for(let i = 0; i < size; i++) {
    const nextAdvId = prng.nextArrayItem(adventurersLeft)
    party.push(parseInt(nextAdvId))
    adventurersLeft.splice(
      adventurersLeft.indexOf(nextAdvId),
      1
    )
  }
  return {
    party,
    adventurersLeft
  }
}

/**
 * Find closest block after the target time
 */

export async function closestLaterBlockHash(
  targetTime: number,
  provider: providers.BaseProvider | string,
  newBlock?: providers.Block,
  previousBlock?: providers.Block
): Promise<string | null> {
  if (typeof provider === "string") { provider = makeProvider(provider)}

  if (!newBlock) {
    newBlock = await provider.getBlock("latest")
    // if chain hasn't reached target time
    if (targetTime >= newBlock.timestamp) { return null }
  }
  
  const timeDifference = newBlock.timestamp - targetTime
  if (timeDifference === 0) { 
    console.log('time difference 0', newBlock.timestamp, targetTime)
    return newBlock.hash 
  }

  let newNewBlock: providers.Block | null = null

  if (previousBlock) {
    const previousTimeDifference = previousBlock.timestamp - targetTime
    if (
      (
        // previous block is closer than new block
        Math.abs(previousTimeDifference) > Math.abs(timeDifference) ||
        // or previous block is after target time
        previousTimeDifference > 0
      ) &&
      // new block is before target time
      timeDifference < 0
    ) {
      // previous block is a single block after new block
      if (previousBlock.number === newBlock.number + 1) {
        console.log('found block', previousBlock.timestamp, targetTime)
        return previousBlock.hash
      }
      newNewBlock = await provider.getBlock(newBlock.number + 1)
    } else if (
      (
        // new block is closer than previous block
        Math.abs(timeDifference) > Math.abs(previousTimeDifference) ||
        // or new block is after target time
        timeDifference > 0
      ) &&
      // previous block is before target time
      previousTimeDifference < 0
    ) {
      // previous block is a single block before new block
      if (previousBlock.number === newBlock.number - 1) {
        console.log('found block', newBlock.timestamp, targetTime)
        return newBlock.hash
      }
      newNewBlock = await provider.getBlock(newBlock.number - 1)
    }
  }

  if (!newNewBlock) {
    newNewBlock = await provider.getBlock(
      Math.floor(newBlock.number - (timeDifference / 13.3)) // 13.3 = avg block time
    )
  }
  
  return closestLaterBlockHash(
    targetTime,
    provider,
    newNewBlock,
    newBlock
  )
}

/**
 * Find closest block with timestamp greater than given timestamp
 * using binary search, assuming starting point based on avg blocktime
 */

/*
export async function findBlockHashNear(
  targetTime: number,
  provider: providers.BaseProvider | string
): Promise<string | null> {
  if (typeof provider === "string") { provider = makeProvider(provider)}

  const firstBlock = await provider.getBlock(1)
  if (targetTime < firstBlock.timestamp) { return firstBlock.hash }

  const latestBlock = await provider.getBlock("latest")
  if (targetTime >= latestBlock.timestamp) { return null }

  const timeAgo = latestBlock.timestamp - targetTime
  const assumedStartBlock = await provider.getBlock(
    Math.floor(latestBlock.number - (timeAgo * 1.1 / 13.3)) // 13.3 = avg block time
  )
  if (targetTime >= assumedStartBlock.timestamp) {
    return (await closestLaterBlock(
      targetTime,
      provider,
      assumedStartBlock,
      latestBlock
    )).hash
  }

  // if our assumption failed, start from the beginning
  return (await closestLaterBlock(
    targetTime,
    provider,
    firstBlock,
    latestBlock
  )).hash
}

async function closestLaterBlock(
  targetTime: number,
  provider: providers.BaseProvider,
  startBlock: providers.Block,
  endBlock: providers.Block
): Promise<providers.Block> {
  const checkBlockNumber = Math.floor(
    (startBlock.number + endBlock.number)/2
  )
  const checkBlock = await provider.getBlock(checkBlockNumber)
  if (targetTime >= checkBlock.timestamp) {
    const nextBlock = await provider.getBlock(checkBlockNumber + 1)
    if (targetTime < nextBlock.timestamp) {
      console.log('found block', nextBlock.timestamp, targetTime)
      return nextBlock
    }
    return await closestLaterBlock(
      targetTime,
      provider,
      checkBlock,
      endBlock
    )
  }
  return await closestLaterBlock(
    targetTime,
    provider,
    startBlock,
    checkBlock
  )
}
*/