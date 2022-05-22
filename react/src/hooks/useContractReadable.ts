import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { RPC_URIS } from '../constants'
import { NetworkName } from '../utils'

export default (
  contractAddress: string,
  abi: ContractInterface,
  network: NetworkName
): Contract | null => {
  const api = RPC_URIS[network]
  if (!api) return null
  const provider = new JsonRpcProvider(api)

  return new Contract(contractAddress, abi, provider)
}
