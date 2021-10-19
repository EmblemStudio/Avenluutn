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

import { nameString } from './loot'
import { randomQuest } from './oc/methods'
import { makeProvider, closestLaterBlockHash, makeParty } from './utils'
import { State, Adventurer, Quest } from './oc/interfaces'

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

  const startBlockHash = await closestLaterBlockHash(startTime, provider)
  if (!startBlockHash) { 
    console.warn(`No block found after start time ${startTime}.`) 
    return [NOT_STARTED]
  }

  const prng = new Prando(startBlockHash)

  const beginning = await tellBeginning(
    prng,
    state,
    startTime,
    length,
    copyNumber,
    provider
  )
  console.log(startTime, length, beginning.endTime, beginning.obstacleTimes)
  const middle = await tellMiddle(
    prng,
    state,
    beginning,
    provider
  )
  const ending = await tellEnding(
    middle,
    provider
  )
  return [...beginning.text, middle, ending]
}

interface Beginning {
  party: Adventurer[];
  quest: Quest;
  endTime: number;
  obstacleTimes: number[];
  text: string[];
}

async function tellBeginning(
  prng: Prando,
  state: State,
  startTime: number, 
  length: number, 
  guildNumber: number,
  provider: providers.BaseProvider
): Promise<Beginning> {
  // Load guild
  const guild = state.guilds[guildNumber]
  if (!guild) { throw new Error("No guild") }

  /**
   * Make random party
   */
  const party: Adventurer[] = makeParty(
    prng,
    prng.nextInt(3, 5),
    Object.keys(guild.adventurers)
  ).party.map(id => {
    const adv = guild.adventurers[id]
    if (!adv) { throw new Error("No adventurer") }
    return adv
  })
  let partyNames = ""
  party.forEach((a, i) => {
    if (i === party.length - 1) {
      partyNames += `and ${nameString(a.name)}`
    } else {
      partyNames += `${nameString(a.name)}, `
    }
  })
  const guildText = `At ${guild.name} in ${guild.location}, ${partyNames} have gathered.`

  /**
   * Generate quest
   */
  const quest = randomQuest(prng)
  let questText = `Consulting the guild, they choose their quest: to ${quest.type} the`
  if (quest.firstAdjective) {
    questText += ` ${quest.firstAdjective}`
  }
  if (quest.secondAdjective) {
    questText += `, ${quest.secondAdjective}`
  }
  questText += ` ${quest.objective}`
  if (quest.firstName) {
    questText += ` "${quest.firstName} ${quest.lastName}"`
  }
  questText += ` at the ${quest.locationName} ${quest.locationType}.`
  
  /**
   * Create obstacle times and end time
   * 
   * TODO add the possibility of a boon in addition to obstacles
   */
  const endTime = startTime + length
  const obstacleTimes = []
  for(let i = 1; i < quest.difficulty + 1; i++) {
    obstacleTimes.push(
      Math.floor(startTime + length / (quest.difficulty + 1) * i)
    )
  }

  return {
    party,
    quest,
    endTime,
    obstacleTimes,
    text: [guildText, questText]
  }
}

interface Middle {

}

async function tellMiddle(
  prng: Prando,
  state: State,
  beginning: Beginning,
  provider: providers.BaseProvider
): Promise<string> {
  /**
   * For each obstacle time, make an obstacle with 1 more difficulty,
   * then find the results
   */
  return "middle"
}

async function tellEnding(
  middle: string,
  provider: providers.BaseProvider
): Promise<string> {
  return "ending"
}