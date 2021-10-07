// Names: https://etherscan.io/address/0xb9310af43f4763003f42661f6fc098428469adab

import { ethers } from 'ethers'

import { makeProvider } from '../../utils'
import * as namesAbi from '../abis/names.json'

const NAMES_ADDR = "0xb9310af43f4763003f42661f6fc098428469adab"

interface Name {
  id: number;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
}

function makeNames(providerUrl?: string): ethers.Contract {
  const provider = makeProvider(providerUrl)
  return new ethers.Contract(
    NAMES_ADDR,
    namesAbi,
    provider
  )
}

export async function getName(
  nameId: number, 
  providerUrl?: string
): Promise<Name> {
  if (1 > nameId || nameId > 8021) { 
    throw new Error("nameId must be between 1 and 8020") 
  }

  const names = makeNames(providerUrl)

  const [prefix, firstName, middleName, lastName, suffix] =
    await Promise.all([
      names.getPrefix(nameId),
      names.getFirstName(nameId),
      names.getMiddleName(nameId),
      names.getLastName(nameId),
      names.getSuffix(nameId)
    ])

  return {
    id: nameId,
    prefix,
    firstName,
    middleName,
    lastName,
    suffix
  }
}