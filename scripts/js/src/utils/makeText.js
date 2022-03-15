"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTriggerText = exports.makeKnockoutText = exports.makeTraitText = exports.makeSkillText = exports.makeLootText = exports.makeDeathText = exports.makeInjuryText = exports.makeEndingText = exports.makeOutcomeText = exports.makeObstacleText = exports.makeQuestText = exports.makeGuildText = void 0;
const interfaces_1 = require("./interfaces");
const loot_1 = require("../content/loot");
function makeGuildText(guild, party) {
    if (party.length < 3) {
        return [{ string: `With too few adventurers to embark, the guild stagnates. `, label: interfaces_1.Label.conjunctive }];
    }
    const res = [
        { string: ``, label: interfaces_1.Label.conjunctive },
        { string: `At `, label: interfaces_1.Label.conjunctive },
        { string: guild.name, label: interfaces_1.Label.guildName, entityId: guild.id },
        { string: ` in `, label: interfaces_1.Label.conjunctive },
        { string: guild.location, label: interfaces_1.Label.locationName },
        { string: `, `, label: interfaces_1.Label.conjunctive }
    ];
    party.forEach((a, i) => {
        if (i === party.length - 1) {
            res.push({ string: `and `, label: interfaces_1.Label.conjunctive });
            res.push({ string: `${(0, loot_1.nameString)(a.name)} `, label: interfaces_1.Label.adventurerName, entityId: a.id });
        }
        else {
            res.push({ string: `${(0, loot_1.nameString)(a.name)}, `, label: interfaces_1.Label.adventurerName, entityId: a.id });
        }
    });
    res.push({ string: `gathered. `, label: interfaces_1.Label.conjunctive });
    return res;
}
exports.makeGuildText = makeGuildText;
function makeQuestText(quest) {
    const res = [
        { string: `Consulting the guild, they chose their quest: to `, label: interfaces_1.Label.conjunctive },
        { string: quest.type.toLowerCase(), label: interfaces_1.Label.questType },
        { string: ` the `, label: interfaces_1.Label.conjunctive }
    ];
    // let text = `Consulting the guild, they chose their quest: to ${quest.type} the`
    if (quest.firstAdjective)
        res.push({ string: quest.firstAdjective, label: interfaces_1.Label.adjective });
    if (quest.secondAdjective) {
        res.push({ string: `, `, label: interfaces_1.Label.conjunctive }, { string: quest.secondAdjective, label: interfaces_1.Label.adjective });
        // text += `, ${quest.secondAdjective}`
    }
    res.push({ string: ` ${quest.objective}`, label: interfaces_1.Label.questObjective });
    // text += ` ${quest.objective}`
    if (quest.firstName) {
        res.push({ string: ` "${quest.firstName} ${quest.lastName}"`, label: interfaces_1.Label.obstacleName });
        // text += ` "${quest.firstName} ${quest.lastName}"`
    }
    res.push({ string: ` at the `, label: interfaces_1.Label.conjunctive }, { string: `${quest.locationName} `, label: interfaces_1.Label.locationName }, { string: quest.locationType, label: interfaces_1.Label.locationType }, { string: `.`, label: interfaces_1.Label.conjunctive });
    // text += ` at the ${quest.locationName} ${quest.locationType}.`
    return res;
}
exports.makeQuestText = makeQuestText;
function lastAdventurer(party, results) {
    let lastAdv;
    const stillUp = [...party];
    results.forEach(r => {
        if (r.type === interfaces_1.ResultType.Death || r.type === interfaces_1.ResultType.Knockout) {
            stillUp.forEach((adv, i) => {
                if (adv.id === r.advId)
                    delete stillUp[i];
            });
            if (Object.keys(stillUp).length === 1) {
                lastAdv = stillUp[0];
            }
        }
    });
    return lastAdv;
}
function makeObstacleText(obstacle, party, results) {
    const lastAdv = lastAdventurer(party, results);
    const res = [];
    if (obstacle.quest) {
        if (lastAdv !== undefined) {
            res.push({ string: `${lastAdv.name.firstName} `, label: interfaces_1.Label.conjunctive });
        }
        else {
            res.push({ string: `They `, label: interfaces_1.Label.conjunctive });
        }
        res.push({ string: `arrived at the `, label: interfaces_1.Label.conjunctive }, { string: obstacle.quest.locationName, label: interfaces_1.Label.locationName }, { string: ` ${obstacle.quest.locationType}`, label: interfaces_1.Label.locationType }, { string: `, where `, label: interfaces_1.Label.conjunctive });
        if (lastAdv !== undefined) {
            res.push({ string: `${lastAdv.pronouns.subject} `, label: interfaces_1.Label.conjunctive });
        }
        else {
            res.push({ string: `they `, label: interfaces_1.Label.conjunctive });
        }
        // text += `They arrived at the ${obstacle.quest.locationName} ${obstacle.quest.locationType}, where they`
    }
    else {
        res.push({ string: `${obstacle.arrival}, `, label: interfaces_1.Label.conjunctive });
        if (lastAdv !== undefined) {
            res.push({ string: `${lastAdv.name.firstName} `, label: interfaces_1.Label.conjunctive });
        }
        else {
            res.push({ string: `they `, label: interfaces_1.Label.conjunctive });
        }
    }
    res.push({ string: `${obstacle.discovery} `, label: interfaces_1.Label.obstacleDiscovery });
    // text += ` ${obstacle.discovery}`
    if (obstacle.firstName) {
        res.push({ string: `the `, label: interfaces_1.Label.conjunctive });
        // text += ` the`
    }
    else {
        let firstWord = obstacle.object[0];
        if (obstacle.firstAdjective)
            firstWord = obstacle.firstAdjective;
        if (!firstWord) {
            throw new Error("No first word");
        }
        const firstChar = firstWord[0];
        if (!firstChar) {
            throw new Error("No first character");
        }
        const lastChar = obstacle.object[obstacle.object.length - 1];
        if (!lastChar) {
            throw new Error("No last character");
        }
        if (lastChar === "s") {
            res.push({ string: `some `, label: interfaces_1.Label.conjunctive });
            // text += ` some` 
        }
        else if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
            res.push({ string: `an `, label: interfaces_1.Label.conjunctive });
            // text += ` an`
        }
        else {
            res.push({ string: `a `, label: interfaces_1.Label.conjunctive });
            // text += ` a`
        }
    }
    if (obstacle.firstAdjective)
        res.push({ string: `${obstacle.firstAdjective}`, label: interfaces_1.Label.adjective });
    // text += ` ${obstacle.firstAdjective}`
    if (obstacle.secondAdjective)
        res.push({ string: `, ${obstacle.secondAdjective}`, label: interfaces_1.Label.adjective });
    // text += ` ${obstacle.secondAdjective}`
    res.push({ string: ` ${obstacle.object}`, label: interfaces_1.Label.object });
    // text += ` ${obstacle.object}`
    if (obstacle.firstName)
        res.push({ string: ` "${obstacle.firstName} ${obstacle.lastName}"`, label: interfaces_1.Label.obstacleName });
    // text += ` ${obstacle.firstName} ${obstacle.lastName}`
    if (obstacle.additions) {
        obstacle.additions.forEach(addition => {
            res.push({ string: `, ${addition}`, label: interfaces_1.Label.conjunctive });
            // text += `, ${addition}`
        });
    }
    res.push({ string: `.`, label: interfaces_1.Label.conjunctive });
    // text += `.`
    // return text
    return res;
}
exports.makeObstacleText = makeObstacleText;
// TODO account for one adventurer being left in outcome text
function makeOutcomeText(outcome, party, results) {
    const lastAdv = lastAdventurer(party, results);
    let res = { main: [], triggerTexts: [], resultTexts: [] };
    res.main.push({ string: `After `, label: interfaces_1.Label.conjunctive }, { string: `${outcome.adjective} `, label: interfaces_1.Label.adjective }, { string: `${outcome.activity}`, label: interfaces_1.Label.outcomeActivity });
    if (lastAdv !== undefined) {
        res.main.push({ string: `, ${lastAdv.name.firstName} `, label: interfaces_1.Label.conjunctive });
    }
    else {
        res.main.push({ string: `, they `, label: interfaces_1.Label.conjunctive });
    }
    res.main.push({ string: `${outcome.resolver}`, label: interfaces_1.Label.outcomeResolver }, { string: ` the `, label: interfaces_1.Label.conjunctive }, { string: `${outcome.obstacle.object}`, label: interfaces_1.Label.object }, { string: `.`, label: interfaces_1.Label.conjunctive });
    // res.main = `After ${outcome.adjective} ${outcome.activity}, they ${outcome.resolver} the ${outcome.obstacle.object}.`
    outcome.triggers.forEach(trigger => {
        res.triggerTexts.push(trigger.text);
    });
    outcome.results.forEach(result => {
        res.resultTexts.push(result.text);
    });
    return res;
}
exports.makeOutcomeText = makeOutcomeText;
function makeEndingText(beginning, middle, everyoneDied, oneLeft, endingResults) {
    const res = {
        main: [],
        resultTexts: []
    };
    if (everyoneDied) {
        res.main.push({ string: `None who set out returned alive.`, label: interfaces_1.Label.conjunctive });
        // res[0] = `None who set out returned alive.`
    }
    else {
        if (oneLeft) {
            res.main.push({ string: `The last adventurer `, label: interfaces_1.Label.conjunctive });
            // res[0] += `The last adventurer `
        }
        else {
            res.main.push({ string: `The adventurers `, label: interfaces_1.Label.conjunctive });
            // res[0] += `The adventurers `
        }
        if (middle.questSuccess === interfaces_1.Success.failure) {
            res.main.push({ string: `slunk back to `, label: interfaces_1.Label.conjunctive }, { string: `${beginning.guild.name}`, label: interfaces_1.Label.guildName, entityId: beginning.guild.id }, { string: ` in disgrace.`, label: interfaces_1.Label.conjunctive });
            // res[0] += `slunk back to ${beginning.guild.name} in disgrace.`
        }
        else if (middle.questSuccess === interfaces_1.Success.mixed) {
            res.main.push({ string: `returned to `, label: interfaces_1.Label.conjunctive }, { string: `${beginning.guild.name}`, label: interfaces_1.Label.guildName, entityId: beginning.guild.id }, { string: `, exhausted but successful.`, label: interfaces_1.Label.conjunctive });
            // res[0] += `returned to ${beginning.guild.name}, exhausted but successful.`
        }
        else if (middle.questSuccess === interfaces_1.Success.success) {
            res.main.push({ string: `returned triumphantly to `, label: interfaces_1.Label.conjunctive }, { string: `${beginning.guild.name}`, label: interfaces_1.Label.guildName, entityId: beginning.guild.id }, { string: `, basking in glory.`, label: interfaces_1.Label.conjunctive });
            // res[0] += `returned triumphantly to ${beginning.guild.name}, basking in glory.`
        }
    }
    endingResults.forEach(result => {
        res.resultTexts.push(result.text);
    });
    return res;
}
exports.makeEndingText = makeEndingText;
function insertPronouns(string, pronouns) {
    const pronounTypes = Object.keys(pronouns);
    const splitString = string.split("*");
    if (splitString.length < 1)
        return string;
    splitString.forEach((s, i) => {
        pronounTypes.forEach(pt => {
            if (s === pt) {
                const pronoun = pronouns[pt];
                if (!pronoun)
                    throw new Error("No pronoun");
                splitString[i] = pronoun;
            }
        });
    });
    return splitString.join('');
}
function makeInjuryText(adventurer, injuryString) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: insertPronouns(` ${injuryString}.`, adventurer.pronouns), label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeInjuryText = makeInjuryText;
function makeDeathText(adventurer) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: ` died.`, label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeDeathText = makeDeathText;
function makeLootText(adventurer, lootPiece) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: ` found `, label: interfaces_1.Label.conjunctive },
        { string: `${lootPiece}`, label: interfaces_1.Label.lootName },
        { string: `!`, label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeLootText = makeLootText;
function makeSkillText(adventurer, skill) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: ` learned `, label: interfaces_1.Label.conjunctive },
        { string: `${skill}`, label: interfaces_1.Label.skillName },
        { string: `!`, label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeSkillText = makeSkillText;
function makeTraitText(adventurer, trait) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: ` now has `, label: interfaces_1.Label.conjunctive },
        { string: `${trait}`, label: interfaces_1.Label.traitName },
        { string: `!`, label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeTraitText = makeTraitText;
function makeKnockoutText(adventurer) {
    return [
        { string: `${(0, loot_1.nameString)(adventurer.name)}`, label: interfaces_1.Label.adventurerName, entityId: adventurer.id },
        { string: ` was knocked out.`, label: interfaces_1.Label.conjunctive }
    ];
}
exports.makeKnockoutText = makeKnockoutText;
function makeTriggerText(triggerInfo, adventurer, traits, qualities) {
    const res = [];
    if (triggerInfo.type === "traits") {
        const traitArray = traits[triggerInfo.name];
        if (!traitArray)
            throw new Error("No traitArray");
        const trait = traitArray[0];
        if (!trait)
            throw new Error("No trait");
        if (triggerInfo.modifier > 0 && trait.positiveTrigger) {
            res.push({ string: `${(0, loot_1.nameString)(adventurer.name)} `, label: interfaces_1.Label.adventurerName, entityId: adventurer.id }, { string: `${insertPronouns(trait.positiveTrigger, adventurer.pronouns)}!`, label: interfaces_1.Label.conjunctive });
        }
        else if (trait.negativeTrigger) {
            res.push({ string: `${(0, loot_1.nameString)(adventurer.name)} `, label: interfaces_1.Label.adventurerName, entityId: adventurer.id }, { string: `${insertPronouns(trait.negativeTrigger, adventurer.pronouns)}!`, label: interfaces_1.Label.conjunctive });
        }
    }
    else if (triggerInfo.type === "skills") {
        res.push({ string: `${(0, loot_1.nameString)(adventurer.name)} `, label: interfaces_1.Label.adventurerName, entityId: adventurer.id }, { string: `used ${adventurer.pronouns.depPossessive} `, label: interfaces_1.Label.conjunctive }, { string: `${triggerInfo.name} `, label: interfaces_1.Label.skillName }, { string: `skills!`, label: interfaces_1.Label.conjunctive });
    }
    else if (triggerInfo.type === "loot") {
        let usedLoot = "";
        qualities.forEach(lootPiece => {
            const index = lootPiece.indexOf(triggerInfo.name);
            if (index >= 0) {
                usedLoot = lootPiece;
            }
        });
        if (usedLoot !== "") {
            res.push({ string: `${(0, loot_1.nameString)(adventurer.name)} `, label: interfaces_1.Label.adventurerName, entityId: adventurer.id }, { string: `used ${adventurer.pronouns.depPossessive} `, label: interfaces_1.Label.conjunctive }, { string: `${usedLoot}`, label: interfaces_1.Label.lootName }, { string: `!`, label: interfaces_1.Label.conjunctive });
        }
    }
    return res;
}
exports.makeTriggerText = makeTriggerText;
