// Class: https://etherscan.io/address/0xccab950f5b192603a94a26c4fa00c8d2d392b98d

import { providers, Contract } from 'ethers'
import Prando from 'prando'

import { makeProvider } from '../../../utils'
import * as classAbi from '../abis/class.json'

const CLASS_ADDR = "0xccab950f5b192603a94a26c4fa00c8d2d392b98d"
const MIN_ID = 1
const MAX_ID = 10000

interface ClassInstance {
  id: number;
  gender: string;
  race: string;
  class: string;
}

function makeClass(provider?: providers.BaseProvider | string): Contract {
  if (!(provider instanceof providers.BaseProvider)) {
    provider = makeProvider(provider)
  }
  return new Contract(
    CLASS_ADDR,
    classAbi,
    provider
  )
}

export async function getClassInstance(
  classId: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<ClassInstance> {
  if (classId < MIN_ID || classId > MAX_ID) {
    throw new Error(`classId must be between ${MIN_ID} and ${MAX_ID}`)
  }

  const class_ = makeClass(provider)

  const [gender, race, _class] =
    await Promise.all([
      class_.getGender(classId),
      class_.getRace(classId),
      class_.getClass(classId),
    ])

  const res = {
    id: classId,
    gender: gender.split(": ")[1],
    race: race.split(": ")[1],
    class: _class.split(": ")[1]
  }

  // Add a chance of rat!
  // 9 races total in the contract, so a 1/10 chance of being a rat
  const roll = prng.nextInt(1, 10)
  if (roll === 10) res.race = "Rat"

  return res
}

export async function getRandomClass(
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<ClassInstance> {
  const classId = prng.nextInt(MIN_ID, MAX_ID)
  return await getClassInstance(classId, prng, provider)
}