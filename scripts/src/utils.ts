import { providers } from 'ethers'

export function makeProvider(providerUrl?: string): providers.BaseProvider {
  if (providerUrl) { return new providers.JsonRpcProvider(providerUrl) }
  return providers.getDefaultProvider()
}

/**
 * Find closest block with timestamp greater than given timestamp
 * using binary search, assuming starting point based on avg blocktime
 */

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