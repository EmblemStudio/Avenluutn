import { providers } from 'ethers'

export function makeProvider(providerUrl?: string): providers.BaseProvider {
  if (providerUrl) { return new providers.JsonRpcProvider(providerUrl) }
  return providers.getDefaultProvider()
}

/**
 * If `time` has been reached, try to get closest later block
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

  const startBlockHash = await closestLaterBlockHash(time, provider)
  if (!startBlockHash) { 
    console.warn(`No block found after time ${time}.`) 
    return null
  }
  return startBlockHash
}

/**
 * Find closest block after the target time
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
export async function closestLaterBlockHash(
  targetTime: number,
  provider: providers.BaseProvider | string,
  block?: providers.Block,
  previousBlock?: providers.Block
): Promise<string | null> {

  if (typeof provider === "string") { provider = makeProvider(provider)}

  if (!block) {
    block = await provider.getBlock("latest")
    if (targetTime >= block.timestamp) { 
      console.warn(`Chain hasn't reached time ${targetTime} yet.`)
      return null 
    }
  }

  // Will be negative if block is EARLIER than target time
  const timeDifference = block.timestamp - targetTime

  if (timeDifference === 0) { 
    return block.hash 
  }

  let newBlock = await provider.getBlock(
    Math.floor(block.number - (timeDifference / 13.3)) // 13.3 = avg block time
  )

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
    if (block.timestamp < targetTime) {
      newBlock = await provider.getBlock(block.number + 1)
    } else {
      newBlock = await provider.getBlock(block.number - 1)
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

  return await closestLaterBlockHash(targetTime, provider, newBlock, block)
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