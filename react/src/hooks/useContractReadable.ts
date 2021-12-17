import { getDefaultProvider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { RPC_URIS, NetworkName } from '../constants'

export default (
  contractAddress: string,
  abi: ContractInterface,
  network: NetworkName
): Contract | null => {
  const api = RPC_URIS[network]
  console.log("provider api", api)
  if (!api) return null
  const provider = getDefaultProvider(api)

  return new Contract(contractAddress, abi, provider)
}
