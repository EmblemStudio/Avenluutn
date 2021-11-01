import Prando from 'prando'
import { providers } from 'ethers'

import { getRandomName, getRandomClass, getRandomLootPiece } from '../src/loot'
import { State, Guild, Character, Adventurer, Stats } from '../src/oc/interfaces'
import { makeParty } from '../src/utils'
import {
  pronounsSource, 
  skills, 
  traits, 
  guildNames, 
  guildMottos, 
  guildLocations 
} from '../src/oc/sourceArrays'
import { stringify } from 'querystring';

// TODO Prando input should match block hash format
export const testPrng = new Prando(123456)

export async function randomStartingState(
  numberOfGuilds: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<State> {
  let state: State = { guilds: [] }
  for(let i = 0; i < numberOfGuilds; i++) {
    const subPrng = new Prando(prng.nextInt(0, 1000000)+i)
    const guild = await randomGuild(i, subPrng, state, provider)
    state.guilds.push(guild)
  }
  return state
}

export async function randomGuild(
  id: number,
  prng: Prando,
  previousState: State,
  provider?: providers.BaseProvider | string
): Promise<Guild> {
  const adventurers = await makeRandomAdventurers(
    prng.nextInt(3, 5), 
    prng, 
    provider
  )
  const name = uniqueArrayItem<string, Guild>(
    prng,
    guildNames,
    previousState.guilds,
    (name: string, guild: Guild) => name === guild.name
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

function uniqueArrayItem<T, S>(
  prng: Prando, 
  array: T[], 
  alreadyChosen: S[],
  same: Function
): T {
  let item = prng.nextArrayItem(array)
  let itemRepeat = true
  while (itemRepeat === true) {
    let repeat = false
    alreadyChosen.forEach(t => {
      if (same(item, t)) repeat = true
    })
    if (repeat === false) {
      itemRepeat = false
    } else {
      item = prng.nextArrayItem(array)
    }
  }
  return item
}

export function makeRandomParties(
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
        Object.keys(traits),
        prng
      )
    }
  }
  return newChar
}

const existingAdv: { [id: string]: Adventurer } = {}

async function makeRandomAdventurers(
  numberToMake: number,
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<{ [id: string]: Adventurer }> {
  const res: { [id: string]: Adventurer } = {}
  const numberExisting = Object.keys(existingAdv).length
  for(let i = 0; i < numberToMake; i++) {
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
