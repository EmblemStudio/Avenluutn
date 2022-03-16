import { ContractInterface, Contract } from '@ethersproject/contracts'
import { useContract, useNetwork } from 'wagmi'

import useSigner from './useSigner'
import { WARNINGS } from '../constants'

export default (contractAddress: string, abi: ContractInterface, network: string): Contract | string => {
  const { data: signer } = useSigner()
  const contract: Contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: signer
  })
  const [{ data: currentNetwork }] = useNetwork()
  if (signer?.provider === undefined) return WARNINGS.no_connection
  console.log('networks', network, "|", currentNetwork.chain?.name?.toLowerCase())
  if (network !== currentNetwork.chain?.name?.toLowerCase()) return WARNINGS.wrong_network
  return contract
}