import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'

export function getContractWritable(
  contractAddress: string,
  abi: ContractInterface,
  externalProvider: ExternalProvider | JsonRpcFetchFunc
): Contract {
  const provider = new Web3Provider(externalProvider)
  const signer = provider.getSigner()

  return new Contract(contractAddress, abi, signer)
}