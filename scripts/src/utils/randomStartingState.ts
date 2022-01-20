import Prando from 'prando'
import { providers } from 'ethers'

import { getRandomName, getRandomClass, getRandomLootPiece } from '../content/loot'
import { State, Guild, Character, Adventurer, Stats } from './interfaces'
import {
  pronounsSource,
  skills,
  traits,
  guildNames,
  guildMottos,
  guildLocations
} from '../content/original/originalContent'

export async function randomStartingState(
  numberOfGuilds: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<State> {
  let state: State = { guilds: [] }
  for (let i = 0; i < numberOfGuilds; i++) {
    const subPrng = new Prando(prng.nextInt(0, 1000000) + i)
    const guild = await randomGuild(i, subPrng, state, provider)
    state.guilds.push(guild)
  }
  return state
}

async function randomGuild(
  id: number,
  prng: Prando,
  previousState: State,
  provider?: providers.BaseProvider | string
): Promise<Guild> {
  const adventurers = await makeRandomAdventurers(
    prng.nextInt(10, 15),
    prng,
    provider
  )
  const name = randomUnusedItem<string>(
    previousState.guilds.map(g => g.name),
    () => prng.nextArrayItem(guildNames)
  )
  return {
    id,
    name,
    motto: prng.nextArrayItem(guildMottos),
    location: prng.nextArrayItem(guildLocations),
    bard: await randomCharacter(prng, provider, 2),
    adventurers,
    graveyard: {},
    adventurerCredits: {},
    gold: 0
  }
}

export function randomParty(
  prng: Prando,
  size: number,
  adventurersLeft: string[]
): { party: number[], adventurersLeft: string[] } {
  if (size > adventurersLeft.length) size = adventurersLeft.length
  const party: number[] = []
  for (let i = 0; i < size; i++) {
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

/*
function makeRandomParties(
  prng: Prando,
  adventurers: { [id: number]: Adventurer }
): number[][] {
  /**
   * if there are > 8 adventurers left, break off 3-5 into a party and go again
   * if there are 6, 7, or 8 adventurers left, break off 3, then break off the rest, then return
   * if there are 5 or fewer, break them off and return

  const res: number[][] = []
  let adventurersLeft = [...Object.keys(adventurers)]
  while (Object.keys(adventurersLeft).length > 8) {
    const partySize = prng.nextInt(3, 5)
    const partyRes = randomParty(prng, partySize, adventurersLeft)
    res.push(partyRes.party)
    adventurersLeft = partyRes.adventurersLeft
  }
  if ([6,7,8].includes(Object.keys(adventurersLeft).length)) {
    const partyRes = randomParty(prng, 3, adventurersLeft)
    res.push(partyRes.party)
    adventurersLeft = partyRes.adventurersLeft
  }
  const partyRes = randomParty(prng, Object.keys(adventurersLeft).length, adventurersLeft)
  res.push(partyRes.party)
  adventurersLeft = partyRes.adventurersLeft
  return res
}
*/

async function randomCharacter(
  prng: Prando,
  provider?: providers.BaseProvider | string,
  traitCount?: number
): Promise<Character> {
  const classInstance = await getRandomClass(prng, provider)
  const pronounKey = Number(prng.nextArrayItem(Object.keys(pronounsSource)))
  const pronounsArray = pronounsSource[pronounKey]
  if (pronounsArray === undefined) throw new Error("pronounsArray")
  const pronouns = pronounsArray[0]
  if (pronouns === undefined) throw new Error("No pronouns")
  const newChar: Character = {
    name: await getRandomName(prng, provider),
    pronouns,
    species: [classInstance.race],
    age: prng.nextInt(19, 105),
    traits: []
  }
  if (traitCount) {
    for (let i = 0; i < traitCount; i++) {
      newChar.traits.push(randomUnusedItem(
        newChar.traits,
        () => prng.nextArrayItem(Object.keys(traits))
      ))
    }
  }
  return newChar
}

const existingAdv: { [id: string]: Adventurer } = {}

// TODO reroll any repeat names
async function makeRandomAdventurers(
  numberToMake: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<{ [id: string]: Adventurer }> {
  const res: { [id: string]: Adventurer } = {}
  const numberExisting = Object.keys(existingAdv).length
  for (let i = 0; i < numberToMake; i++) {
    const newAdv = await randomAdventurer(
      numberExisting + i + 1,
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
    skills: [prng.nextArrayItem(skills)],
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

export function randomUnusedItem<T>(
  used: T[],
  randomItem: Function
): T {
  let item = randomItem()
  while (used.includes(item)) {
    item = randomItem()
  }
  return item
}
