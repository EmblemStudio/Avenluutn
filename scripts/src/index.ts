/**
 * Inputs:
 * - start time: 1633535222 (number, unix timestamp)
 * - time length: number
 * - copy number: number
 * - providerUrl: string
 */

/**
 * Process:
 * - if current block timestamp is before start time, fail
 * - find block hash of next block after start time
 * - 
 */

import Prando from 'prando'
import { providers } from 'ethers'

import { makeProvider, findBlockHashNear } from './utils'
import { State, Adventurer, Quest } from './interfaces'

interface Beginning {
  adventurers: Adventurer[];
  quest: Quest;
  text: string[];
}

const NOT_STARTED = "Nothing stirs."

export async function tellNarrative(
  state: State,
  startTime: number, 
  length: number, 
  copyNumber: number,
  providerUrl?: string
): Promise<string[]> {
  const now = Math.floor(Date.now()/1000)
  if (startTime > now) {
    return [NOT_STARTED]
  }

  const provider = makeProvider(providerUrl)

  const startBlockHash = await findBlockHashNear(startTime, provider)
  if (!startBlockHash) { 
    console.warn(`No block found after start time ${startTime}.`) 
    return [NOT_STARTED]
  }

  const prng = new Prando(startBlockHash)

  const beginning = await tellBeginning(
    startTime,
    length,
    copyNumber,
    provider
  )
  const middle = await tellMiddle(
    beginning,
    provider
  )
  const ending = await tellEnding(
    middle,
    provider
  )
  return [beginning, middle, ending]
}

async function tellBeginning(
  state: State,
  startTime: number, 
  length: number, 
  copyNumber: number,
  provider: providers.BaseProvider
): Promise<Beginning> {
  /**
   * Generate quest
   */

  /**
   * Select adventurers
   * - is it based on the quest?
   * - how do we make sure adventurers can't go on two adventures at once?
   *   - for now, we'll do this by having preset parties
   */
  return "beginning"
}

async function tellMiddle(
  beginning: string,
  provider: providers.BaseProvider
): Promise<string> {
  return "middle"
}

async function tellEnding(
  middle: string,
  provider: providers.BaseProvider
): Promise<string> {
  return "ending"
}