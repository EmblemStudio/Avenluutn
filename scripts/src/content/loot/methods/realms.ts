// Realms: https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d

import { ethers } from 'ethers'

import { makeProvider } from '../../../utils'
import * as realmsAbi from '../abis/realms.json'

const REALMS_ADDR = "0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d"

interface Realm {
  id: number;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
}

function makeRealms(providerUrl?: string): ethers.Contract {
  const provider = makeProvider(providerUrl)
  return new ethers.Contract(
    REALMS_ADDR,
    realmsAbi,
    provider
  )
}

// I don't see how to get any Realms data off the contracts atm