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
import { randomUnusedItem } from '.'

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

export interface GuildOverrides {
  characters: { [key: string]: any }
}

export async function randomGuild(
  id: number,
  prng: Prando,
  previousState: State,
  provider?: providers.BaseProvider | string,
  overrides?: GuildOverrides
): Promise<Guild> {
  const adventurers = await makeRandomAdventurers(
    prng.nextInt(10, 15),
    prng,
    provider,
    overrides
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
    bard: await randomCharacter(prng, provider, 2, overrides?.characters),
    adventurers,
    graveyard: {},
    adventurerCredits: {},
    gold: 0
  }
}

const rareAdvPercent = 5 // / 100

export function randomParty(
  prng: Prando,
  size: number,
  advLeftCommon: string[],
  advLeftRare: string[]
): {
  party: number[],
  rareParty: number[],
  advLeftCommon: string[],
  advLeftRare: string[]
} {
  if (size > advLeftCommon.length) size = advLeftCommon.length
  const party: number[] = []
  const rareParty: number[] = []
  for (let i = 0; i < size; i++) {
    if (advLeftRare.length > 0) {
      const roll = prng.nextInt(0, 100)
      if (roll <= rareAdvPercent) {
        const nextAdvId = prng.nextArrayItem(advLeftRare)
        party.push(parseInt(nextAdvId))
        rareParty.push(parseInt(nextAdvId))
        advLeftRare.splice(advLeftRare.indexOf(nextAdvId), 1)
      } else {
        const nextAdvId = prng.nextArrayItem(advLeftCommon)
        party.push(parseInt(nextAdvId))
        advLeftCommon.splice(advLeftCommon.indexOf(nextAdvId), 1)
      }
    } else {
      const nextAdvId = prng.nextArrayItem(advLeftCommon)
      party.push(parseInt(nextAdvId))
      advLeftCommon.splice(advLeftCommon.indexOf(nextAdvId), 1)
    }
  }
  return {
    party,
    rareParty,
    advLeftCommon,
    advLeftRare
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
  traitCount?: number,
  overrides?: { [key: string]: any }
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
  if (overrides?.species !== undefined) {
    newChar.species = overrides.species
  }
  return newChar
}

const existingAdv: { [id: string]: Adventurer } = {}

// TODO reroll any repeat names
async function makeRandomAdventurers(
  numberToMake: number,
  prng: Prando,
  provider?: providers.BaseProvider | string,
  overrides?: GuildOverrides
): Promise<{ [id: string]: Adventurer }> {
  const res: { [id: string]: Adventurer } = {}
  let numberExisting = Object.keys(existingAdv).length
  if (overrides?.characters.numberExisting) numberExisting = Number(overrides.characters.numberExisting)
  for (let i = 0; i < numberToMake; i++) {
    const newAdv = await randomAdventurer(
      numberExisting + i + 1,
      prng,
      provider,
      overrides
    )
    res[newAdv.id] = newAdv
  }
  Object.assign(existingAdv, res)
  return res
}

async function randomAdventurer(
  id: number,
  prng: Prando,
  provider?: providers.BaseProvider | string,
  overrides?: GuildOverrides
): Promise<Adventurer> {
  const newChar = await randomCharacter(prng, provider, undefined, overrides?.characters)
  const newAdv: Adventurer = Object.assign(newChar, {
    id,
    class: [(await getRandomClass(prng, provider)).class],
    stats: randomStats(prng),
    skills: [prng.nextArrayItem(skills)],
    loot: [await getRandomLootPiece(prng, provider)],
    stories: []
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
