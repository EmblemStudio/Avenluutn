import { useWallet } from 'use-wallet'
import { ContractInterface, Contract } from '@ethersproject/contracts'

import { getContractWritable, noConnection, wrongNetwork } from '../utils'
import { WARNINGS } from '../constants'

export default (contractAddress: string, abi: ContractInterface, network: string): Contract | string => {
  const wallet = useWallet()
  if (noConnection(wallet)) return WARNINGS.no_connection
  if (wrongNetwork(wallet, network)) return WARNINGS.wrong_network
  const contract = getContractWritable(contractAddress, abi, wallet.ethereum)
  return contract
}