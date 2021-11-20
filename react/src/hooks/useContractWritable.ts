import { useWallet } from 'use-wallet'
import { ContractInterface, Contract } from '@ethersproject/contracts'
import getContractWritable from '../utils/getContractWritable'

export default (contractAddress: string, abi: ContractInterface): Contract | null => {
  const wallet = useWallet()

  if (!wallet.ethereum || !contractAddress) return null

  const contract = getContractWritable(contractAddress, abi, wallet.ethereum)

  return contract
}