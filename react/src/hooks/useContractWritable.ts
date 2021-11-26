import { useWallet } from 'use-wallet'
import { ContractInterface, Contract } from '@ethersproject/contracts'
import { getContractWritable } from '../utils'

export default (contractAddress: string, abi: ContractInterface, network: string): Contract | string => {
  const wallet = useWallet()
  if (!wallet.ethereum) return `connect to ${network} to bid or claim`
  if (wallet.networkName !== network) return `switch to ${network} to bid or claim`
  const contract = getContractWritable(contractAddress, abi, wallet.ethereum)
  return contract
}