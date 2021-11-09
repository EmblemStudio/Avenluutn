"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUnusedItem = exports.randomParty = exports.randomStartingState = void 0;
const prando_1 = require("prando");
const loot_1 = require("../content/loot");
const sourceArrays_1 = require("../content/original/sourceArrays");
async function randomStartingState(numberOfGuilds, prng, provider) {
    let state = { guilds: [] };
    for (let i = 0; i < numberOfGuilds; i++) {
        const subPrng = new prando_1.default(prng.nextInt(0, 1000000) + i);
        const guild = await randomGuild(i, subPrng, state, provider);
        state.guilds.push(guild);
    }
    return state;
}
exports.randomStartingState = randomStartingState;
async function randomGuild(id, prng, previousState, provider) {
    const adventurers = await makeRandomAdventurers(prng.nextInt(3, 5), prng, provider);
    /*
    const name = uniqueArrayItem<string, Guild>(
      prng,
      guildNames,
      previousState.guilds,
      (name: string, guild: Guild) => name === guild.name
    )
    */
    const name = randomUnusedItem(previousState.guilds.map(g => g.name), () => prng.nextArrayItem(sourceArrays_1.guildNames));
    return {
        id,
        name,
        motto: prng.nextArrayItem(sourceArrays_1.guildMottos),
        location: prng.nextArrayItem(sourceArrays_1.guildLocations),
        bard: await randomCharacter(prng, provider, 2),
        adventurers,
        graveyard: {},
        adventurerCredits: {},
        gold: 0
    };
}
function randomParty(prng, size, adventurersLeft) {
    if (size > adventurersLeft.length)
        size = adventurersLeft.length;
    const party = [];
    for (let i = 0; i < size; i++) {
        const nextAdvId = prng.nextArrayItem(adventurersLeft);
        party.push(parseInt(nextAdvId));
        adventurersLeft.splice(adventurersLeft.indexOf(nextAdvId), 1);
    }
    return {
        party,
        adventurersLeft
    };
}
exports.randomParty = randomParty;
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
async function randomCharacter(prng, provider, traitCount) {
    const classInstance = await (0, loot_1.getRandomClass)(prng, provider);
    const newChar = {
        name: await (0, loot_1.getRandomName)(prng, provider),
        pronouns: prng.nextArrayItem(sourceArrays_1.pronounsSource),
        species: [classInstance.race],
        age: prng.nextInt(19, 105),
        traits: []
    };
    if (traitCount) {
        for (let i = 0; i < traitCount; i++) {
            /*
            newChar.traits = addRandomUnusedElement(
              newChar.traits,
              Object.keys(traits),
              prng
            )
            */
            newChar.traits.push(randomUnusedItem(newChar.traits, () => prng.nextArrayItem(Object.keys(sourceArrays_1.traits))));
        }
    }
    return newChar;
}
const existingAdv = {};
async function makeRandomAdventurers(numberToMake, prng, provider) {
    const res = {};
    const numberExisting = Object.keys(existingAdv).length;
    for (let i = 0; i < numberToMake; i++) {
        const newAdv = await randomAdventurer(numberExisting + i + 1, prng, provider);
        res[newAdv.id] = newAdv;
    }
    Object.assign(existingAdv, res);
    return res;
}
async function randomAdventurer(id, prng, provider) {
    const newChar = await randomCharacter(prng, provider);
    const newAdv = Object.assign(newChar, {
        id,
        class: [(await (0, loot_1.getRandomClass)(prng, provider)).class],
        stats: randomStats(prng),
        // skills: addRandomUnusedElement<string>([], skills, prng),
        skills: [prng.nextArrayItem(sourceArrays_1.skills)],
        loot: [await (0, loot_1.getRandomLootPiece)(prng, provider)]
    });
    return newAdv;
}
function randomStats(prng) {
    return {
        strength: prng.nextInt(0, 4),
        magic: prng.nextInt(0, 4),
        agility: prng.nextInt(0, 4),
        resourcefulness: prng.nextInt(0, 4),
        toughness: prng.nextInt(0, 4)
    };
}
function randomUnusedItem(used, randomItem) {
    let item = randomItem();
    while (used.includes(item)) {
        item = randomItem();
    }
    return item;
}
exports.randomUnusedItem = randomUnusedItem;
/*
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
*/
/*
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
*/
