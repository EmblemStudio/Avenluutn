import { ContractInterface, Contract } from '@ethersproject/contracts'
import { useContract, useProvider } from 'wagmi'

import { noConnection, wrongNetwork } from '../utils'
import { WARNINGS } from '../constants'

export default (contractAddress: string, abi: ContractInterface, network: string): Contract | string => {
  const contract: Contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi
  })
  const provider = useProvider()
  console.log('writable contract', contract, provider)
  if (noConnection(provider)) return WARNINGS.no_connection
  if (wrongNetwork(provider, network)) return WARNINGS.wrong_network
  return contract
}