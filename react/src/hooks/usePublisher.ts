import { Contract } from '@ethersproject/contracts'

import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import useContractWritable from './useContractWritable'
import { NarratorParams } from '../utils'
import { ADDRESSES } from '../constants'

export default (params: NarratorParams): Contract | string => {
  const searchParams = new URLSearchParams(window.location.search);
  const address = searchParams.get("network") ?? ADDRESSES[params.network]
  if (address === undefined) {
    throw new Error(`Missing required address for ${params.network}`)
  }
  let publisher = useContractWritable(address, artifact.abi, params.network)
  return publisher
}
