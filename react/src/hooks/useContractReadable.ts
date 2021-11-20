import { getDefaultProvider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'

const apis: { [network: string]: string } = {
  ropsten: "https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8"
}

export default (
  contractAddress: string,
  abi: ContractInterface,
  network: string
): Contract | null => {
  const api = apis[network]
  if (!api) return null
  const provider = getDefaultProvider(api)
  
  return new Contract(contractAddress, abi, provider)
}