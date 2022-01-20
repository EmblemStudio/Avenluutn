"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUnusedItem = exports.randomParty = exports.randomStartingState = void 0;
const prando_1 = require("prando");
const loot_1 = require("../content/loot");
const originalContent_1 = require("../content/original/originalContent");
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
    const adventurers = await makeRandomAdventurers(prng.nextInt(10, 15), prng, provider);
    const name = randomUnusedItem(previousState.guilds.map(g => g.name), () => prng.nextArrayItem(originalContent_1.guildNames));
    return {
        id,
        name,
        motto: prng.nextArrayItem(originalContent_1.guildMottos),
        location: prng.nextArrayItem(originalContent_1.guildLocations),
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
    const pronounKey = Number(prng.nextArrayItem(Object.keys(originalContent_1.pronounsSource)));
    const pronounsArray = originalContent_1.pronounsSource[pronounKey];
    if (pronounsArray === undefined)
        throw new Error("pronounsArray");
    const pronouns = pronounsArray[0];
    if (pronouns === undefined)
        throw new Error("No pronouns");
    const newChar = {
        name: await (0, loot_1.getRandomName)(prng, provider),
        pronouns,
        species: [classInstance.race],
        age: prng.nextInt(19, 105),
        traits: []
    };
    if (traitCount) {
        for (let i = 0; i < traitCount; i++) {
            newChar.traits.push(randomUnusedItem(newChar.traits, () => prng.nextArrayItem(Object.keys(originalContent_1.traits))));
        }
    }
    return newChar;
}
const existingAdv = {};
// TODO reroll any repeat names
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
        skills: [prng.nextArrayItem(originalContent_1.skills)],
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
