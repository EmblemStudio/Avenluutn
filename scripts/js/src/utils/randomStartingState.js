"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAdventurer = exports.randomParty = exports.randomGuild = exports.randomStartingState = void 0;
const prando_1 = require("prando");
const loot_1 = require("../content/loot");
const originalContent_1 = require("../content/original/originalContent");
const _1 = require(".");
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
async function randomGuild(id, prng, previousState, provider, overrides) {
    const adventurers = await makeRandomAdventurers(prng.nextInt(10, 15), prng, provider, overrides);
    const name = (0, _1.randomUnusedItem)(previousState.guilds.map(g => g.name), () => prng.nextArrayItem(originalContent_1.guildNames));
    return {
        id,
        name,
        motto: prng.nextArrayItem(originalContent_1.guildMottos),
        location: prng.nextArrayItem(originalContent_1.guildLocations),
        bard: await randomCharacter(prng, provider, 2, overrides === null || overrides === void 0 ? void 0 : overrides.characters),
        adventurers,
        graveyard: {},
        adventurerCredits: {},
        gold: 0
    };
}
exports.randomGuild = randomGuild;
const rareAdvPercent = 5; // / 100
function randomParty(prng, size, advLeftCommon, advLeftRare) {
    if (size > advLeftCommon.length)
        size = advLeftCommon.length;
    const party = [];
    const rareParty = [];
    for (let i = 0; i < size; i++) {
        if (advLeftRare.length > 0) {
            const roll = prng.nextInt(0, 100);
            if (roll <= rareAdvPercent) {
                const nextAdvId = prng.nextArrayItem(advLeftRare);
                party.push(parseInt(nextAdvId));
                rareParty.push(parseInt(nextAdvId));
                advLeftRare.splice(advLeftRare.indexOf(nextAdvId), 1);
            }
            else {
                const nextAdvId = prng.nextArrayItem(advLeftCommon);
                party.push(parseInt(nextAdvId));
                advLeftCommon.splice(advLeftCommon.indexOf(nextAdvId), 1);
            }
        }
        else {
            const nextAdvId = prng.nextArrayItem(advLeftCommon);
            party.push(parseInt(nextAdvId));
            advLeftCommon.splice(advLeftCommon.indexOf(nextAdvId), 1);
        }
    }
    return {
        party,
        rareParty,
        advLeftCommon,
        advLeftRare
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
async function randomCharacter(prng, provider, traitCount, overrides) {
    const classInstance = await (0, loot_1.getRandomClass)(prng, provider);
    const pronounKey = Number(prng.nextArrayItem(Object.keys(originalContent_1.pronounsSource)));
    const pronounsArray = originalContent_1.pronounsSource[pronounKey];
    if (pronounsArray === undefined)
        throw new Error("pronounsArray");
    const pronouns = pronounsArray[0];
    if (pronouns === undefined)
        throw new Error("No pronouns");
    let species = [classInstance.race];
    if ((overrides === null || overrides === void 0 ? void 0 : overrides.species) !== undefined) {
        species = overrides.species;
    }
    const newChar = {
        name: await (0, loot_1.getRandomName)(prng, provider),
        pronouns,
        species: species,
        age: species.includes("Rat") ? prng.nextInt(1, 12) : prng.nextInt(19, 105),
        traits: []
    };
    if (traitCount) {
        for (let i = 0; i < traitCount; i++) {
            newChar.traits.push((0, _1.randomUnusedItem)(newChar.traits, () => prng.nextArrayItem(Object.keys(originalContent_1.traits))));
        }
    }
    return newChar;
}
const existingAdv = {};
// TODO reroll any repeat names
async function makeRandomAdventurers(numberToMake, prng, provider, overrides) {
    const res = {};
    let numberExisting = Object.keys(existingAdv).length;
    if (overrides === null || overrides === void 0 ? void 0 : overrides.characters.numberExisting)
        numberExisting = Number(overrides.characters.numberExisting);
    for (let i = 0; i < numberToMake; i++) {
        const newAdv = await randomAdventurer(numberExisting + i + 1, prng, provider, overrides);
        res[newAdv.id] = newAdv;
    }
    Object.assign(existingAdv, res);
    return res;
}
async function randomAdventurer(id, prng, provider, overrides) {
    const newChar = await randomCharacter(prng, provider, undefined, overrides === null || overrides === void 0 ? void 0 : overrides.characters);
    const newAdv = Object.assign(newChar, {
        id,
        class: [(await (0, loot_1.getRandomClass)(prng, provider)).class],
        stats: randomStats(prng),
        skills: [prng.nextArrayItem(originalContent_1.skills)],
        loot: [await (0, loot_1.getRandomLootPiece)(prng, provider)],
        stories: []
    });
    return newAdv;
}
exports.randomAdventurer = randomAdventurer;
function randomStats(prng) {
    return {
        strength: prng.nextInt(0, 4),
        magic: prng.nextInt(0, 4),
        agility: prng.nextInt(0, 4),
        resourcefulness: prng.nextInt(0, 4),
        toughness: prng.nextInt(0, 4)
    };
}
