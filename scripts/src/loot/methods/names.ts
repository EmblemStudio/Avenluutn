// Names: https://etherscan.io/address/0xb9310af43f4763003f42661f6fc098428469adab

import { providers, Contract } from 'ethers'

import { makeProvider } from '../../utils'
import * as namesAbi from '../abis/names.json'
import Prando from 'prando'

const NAMES_ADDR = "0xb9310af43f4763003f42661f6fc098428469adab"
const MIN_ID = 1
const MAX_ID = 8021

export interface Name {
  id: number;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
}

function makeNames(provider?: providers.BaseProvider | string): Contract {
  if (!(provider instanceof providers.BaseProvider)) {
    provider = makeProvider(provider)
  }
  return new Contract(
    NAMES_ADDR,
    namesAbi,
    provider
  )
}

export async function getName(
  nameId: number, 
  provider?: providers.BaseProvider | string
): Promise<Name> {
  if (nameId < MIN_ID || nameId > MAX_ID) { 
    throw new Error(`nameId must be between ${MIN_ID} and ${MAX_ID}`) 
  }

  const names = makeNames(provider)

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

export async function getRandomName(
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<Name> {
  const nameId = prng.nextInt(MIN_ID, MAX_ID)
  return await getName(nameId, provider)
}

export function nameString(name: Name): string {
  let res = ""
  const prefix = name.prefix
  if (prefix) { res += prefix + " " }
  const firstName = name.firstName
  if (firstName) { res += firstName + " " }
  const middleName = name.middleName
  if (middleName) { res += middleName + " " }
  const lastName = name.lastName
  if (lastName) { res += lastName }
  const suffix = name.suffix
  if (suffix) { res += " " + suffix }
  return res
}