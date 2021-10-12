import Prando from 'prando'
import { providers } from 'ethers'

import { getRandomName, getRandomClass, getRandomLootPiece } from '../src/loot'
import { State, Guild, Character, Pronouns, Adventurer, Stats, Quest } from '../src/interfaces'
import { state } from '../src/state'
import {
  pronounsSource, 
  skills, 
  traits, 
  guildNames, 
  guildMottos, 
  guildLocations 
} from '../src/oc/sourceArrays'

// TODO Prando input should match block hash format
export const testPrng = new Prando(Date.now())

export async function randomStartingState(
  numberOfGuilds: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<State> {
  let res: State = { guilds: [] }
  for(let i = 0; i < numberOfGuilds; i++) {
    const guild = await randomGuild(i, prng, provider)
    res.guilds.push(guild)
  }
  return res
}

export async function randomGuild(
  id: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<Guild> {
  const adventurers = await makeRandomAdventurers(
    prng.nextInt(3, 5), 
    id, 
    prng, 
    provider
  )
  return {
    id,
    name: prng.nextArrayItem(guildNames),
    motto: prng.nextArrayItem(guildMottos),
    location: prng.nextArrayItem(guildLocations),
    bard: await randomCharacter(prng, provider, 2),
    adventurers,
    parties: makeRandomParties(prng, adventurers),
    adventurerCredits: {},
    gold: 0
  }
}

function makeRandomParties(
  prng: Prando,
  adventurers: { [id: number]: Adventurer }
): number[][] {
  /**
   * if there are > 8 adventurers left, break off 3-5 into a party and go again
   * if there are 6, 7, or 8 adventurers left, break off 3, then break off the rest, then return
   * if there are 5 or fewer, break them off and return
   */
  const res: number[][] = []
  let adventurersLeft = [...Object.keys(adventurers)]
  while (Object.keys(adventurersLeft).length > 8) {
    const partySize = prng.nextInt(3, 5)
    const partyRes = makeParty(prng, partySize, adventurersLeft)
    res.push(partyRes.party)
    adventurersLeft = partyRes.adventurersLeft
  }
  if ([6,7,8].includes(Object.keys(adventurersLeft).length)) {
    const partyRes = makeParty(prng, 3, adventurersLeft)
    res.push(partyRes.party)
    adventurersLeft = partyRes.adventurersLeft
  }
  const partyRes = makeParty(prng, Object.keys(adventurersLeft).length, adventurersLeft)
  res.push(partyRes.party)
  adventurersLeft = partyRes.adventurersLeft
  return res
}

function makeParty(
  prng: Prando,
  size: number,
  adventurersLeft: string[]
): { party: number[], adventurersLeft: string[] } {
  const party: number[] = []
  for(let i = 0; i < size; i++) {
    const nextAdvId = prng.nextArrayItem(adventurersLeft)
    party.push(parseInt(nextAdvId))
    adventurersLeft.splice(
      adventurersLeft.indexOf(nextAdvId),
      1
    )
  }
  return {
    party,
    adventurersLeft
  }
}

async function randomCharacter(
  prng: Prando, 
  provider?: providers.BaseProvider | string,
  traitCount?: number
): Promise<Character> {
  const classInstance = await getRandomClass(prng, provider)
  const newChar: Character = {
    name: await getRandomName(prng, provider),
    pronouns: prng.nextArrayItem(pronounsSource),
    species: [classInstance.race],
    age: prng.nextInt(19, 105),
    traits: []
  }
  if (traitCount) {
    for(let i = 0; i < traitCount; i++) {
      newChar.traits = addRandomUnusedElement(
        newChar.traits,
        traits,
        prng
      )
    }
  }
  return newChar
}

const existingAdv: { [id: string]: Adventurer } = {}

async function makeRandomAdventurers(
  numberToMake: number,
  guildId: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<{ [id: string]: Adventurer }> {
  const res: { [id: string]: Adventurer } = Object.assign(
    {},
    existingAdv
  )
  const numberExisting = Object.keys(existingAdv).length
  for(let i = 0; i < numberToMake; i++) {
    const newAdv = await randomAdventurer(
      parseInt(`${guildId}${numberExisting + i}`),
      prng,
      provider
    )
    res[newAdv.id] = newAdv
  }
  Object.assign(existingAdv, res)
  return res
}

async function randomAdventurer(
  id: number,
  prng: Prando, 
  provider?: providers.BaseProvider | string
): Promise<Adventurer> {
  const newChar = await randomCharacter(prng, provider)
  const newAdv: Adventurer = Object.assign(newChar, {
    id,
    class: [(await getRandomClass(prng, provider)).class],
    stats: randomStats(prng),
    skills: addRandomUnusedElement<string>([], skills, prng),
    loot: [await getRandomLootPiece(prng, provider)]
  })
  return newAdv
}

function randomStats(prng: Prando): Stats {
  return {
    strength: prng.nextInt(0, 4),
    magic: prng.nextInt(0, 4),
    agility: prng.nextInt(0, 4),
    resourcefulness: prng.nextInt(0, 4),
    toughness: prng.nextInt(0, 4)
  }
}

function addRandomUnusedElement<T>(
  target: T[], 
  source: T[],
  prng: Prando
): T[] {
  let newItem = target[0]
  if (!newItem) { return [prng.nextArrayItem(source)] }
  while (target.includes(newItem)) {
    newItem = prng.nextArrayItem(source)
  }
  target.push(newItem)
  return target
}
