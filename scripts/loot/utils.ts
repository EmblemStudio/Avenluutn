import { ethers } from 'ethers'

export function makeProvider(providerUrl?: string): ethers.providers.BaseProvider {
  if (providerUrl) { return new ethers.providers.JsonRpcProvider(providerUrl) }
  return ethers.providers.getDefaultProvider()
}