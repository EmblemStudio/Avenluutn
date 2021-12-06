import { getDefaultProvider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { API_URIS } from '../constants'

export default (
  contractAddress: string,
  abi: ContractInterface,
  network: string
): Contract | null => {
  const api = API_URIS[network]
  if (!api) return null
  const provider = getDefaultProvider(api)
  
  return new Contract(contractAddress, abi, provider)
}