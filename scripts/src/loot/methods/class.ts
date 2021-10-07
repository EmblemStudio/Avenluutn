// Class: https://etherscan.io/address/0xccab950f5b192603a94a26c4fa00c8d2d392b98d

import { ethers } from 'ethers'

import { makeProvider } from '../../utils'
import * as classAbi from '../abis/class.json'

const CLASS_ADDR = "0xccab950f5b192603a94a26c4fa00c8d2d392b98d"

interface ClassInstance {
  id: number;
  gender: string;
  race: string;
  class: string;
}

function makeClass(providerUrl?: string): ethers.Contract {
  const provider = makeProvider(providerUrl)
  return new ethers.Contract(
    CLASS_ADDR,
    classAbi,
    provider
  )
}

export async function getClassInstance(
  classId: number, 
  providerUrl?: string
): Promise<ClassInstance> {
  if (1 > classId || classId > 10000) { throw new Error("classId must be between 1 and 8000") }

  const class_ = makeClass(providerUrl)

  const [gender, race, _class] =
    await Promise.all([
      class_.getGender(classId),
      class_.getRace(classId),
      class_.getClass(classId),
    ])

  return {
    id: classId,
    gender: gender.split(": ")[1],
    race: race.split(": ")[1],
    class: _class.split(": ")[1]
  }
}