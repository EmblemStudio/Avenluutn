import { Contract } from '@ethersproject/contracts'

import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import useContractWritable from './useContractWritable'
import { NarratorParams, NetworkName } from '../utils'
import { ADDRESSES } from '../constants'

export default (params: NarratorParams): Contract | string => {
  const address = ADDRESSES[params.network as NetworkName]
  if (address === undefined) {
    throw new Error(`Missing required address for ${params.network}`)
  }
  let publisher = useContractWritable(address, artifact.abi, params.network)
  return publisher
}
