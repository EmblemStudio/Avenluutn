"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOutcome = exports.questObstacle = exports.randomObstacle = exports.randomQuest = void 0;
const interfaces_1 = require("./interfaces");
const sourceArrays_1 = require("../content/original/sourceArrays");
const makeText_1 = require("./makeText");
const loot_1 = require("../content/loot");
const makeText_2 = require("./makeText");
const newCheckpoint_1 = require("./newCheckpoint");
// 1 = verb, objective, location / 2 = verb, adj, obj, loc, 3 = ver, adj, adj, obj, loc, 4 = ver, adj, adj, name, obj, loc
// TODO adjust the RNG so characters are more likely to "select" quests that fit them?
function randomQuest(guildId, prng) {
    const type = prng.nextArrayItem(Object.keys(sourceArrays_1.questTypesAndInfo));
    const questInfo = sourceArrays_1.questTypesAndInfo[type];
    if (!questInfo) {
        throw new Error("No quest info");
    }
    const res = {
        guildId,
        difficulty: prng.nextArrayItem(sourceArrays_1.questDifficulty),
        type,
        objective: prng.nextArrayItem(questInfo.objectives),
        locationName: prng.nextArrayItem(sourceArrays_1.questLocationName),
        locationType: prng.nextArrayItem(sourceArrays_1.questLocationType)
    };
    if (res.difficulty > 1) {
        res.firstAdjective = prng.nextArrayItem(sourceArrays_1.genericFirstAdjectives);
    }
    if (res.difficulty > 2) {
        res.secondAdjective = prng.nextArrayItem(sourceArrays_1.genericSecondAdjectives);
    }
    if (res.difficulty > 3) {
        res.firstName = prng.nextArrayItem(sourceArrays_1.genericFirstName);
        res.lastName = prng.nextArrayItem(sourceArrays_1.genericLastName);
    }
    return res;
}
exports.randomQuest = randomQuest;
function randomObstacle(prng, difficulty) {
    // TODO use an enum for difficulty in randomObstacle
    if (![2, 3, 4, 5].includes(difficulty)) {
        throw new Error("Difficulty must be 2, 3, 4, or 5");
    }
    const type = prng.nextArrayItem(Object.values(sourceArrays_1.ObstacleType));
    const res = {
        difficulty,
        type,
        arrival: prng.nextArrayItem(sourceArrays_1.obstacleArrivals),
        discovery: prng.nextArrayItem(sourceArrays_1.obstacleInfo[type].discovery),
        object: prng.nextArrayItem(sourceArrays_1.obstacleInfo[type].objects),
        // additions: [] TODO additions
    };
    if (res.difficulty > 1) {
        res.firstAdjective = prng.nextArrayItem(sourceArrays_1.genericFirstAdjectives);
    }
    if (res.difficulty > 2) {
        res.secondAdjective = prng.nextArrayItem(sourceArrays_1.genericSecondAdjectives);
    }
    if (res.difficulty > 3) {
        res.firstName = prng.nextArrayItem(sourceArrays_1.genericFirstName);
        res.lastName = prng.nextArrayItem(sourceArrays_1.genericLastName);
    }
    return res;
}
exports.randomObstacle = randomObstacle;
function questObstacle(prng, quest) {
    const goal = quest.type.toUpperCase();
    const type = sourceArrays_1.questObstacleMap[goal];
    if (!type) {
        throw new Error("No type");
    }
    if (type === goal) {
        return randomObstacle(prng, quest.difficulty);
    }
    const obsInfo = sourceArrays_1.obstacleInfo[type];
    if (!obsInfo) {
        throw new Error("No obstacle info");
    }
    const res = {
        difficulty: quest.difficulty,
        type,
        arrival: prng.nextArrayItem(sourceArrays_1.obstacleArrivals),
        discovery: prng.nextArrayItem(obsInfo.discovery),
        object: quest.objective
        // additions: [] TODO additions
    };
    if (quest.firstAdjective)
        res.firstAdjective = quest.firstAdjective;
    if (quest.secondAdjective)
        res.secondAdjective = quest.secondAdjective;
    if (quest.firstName)
        res.firstName = quest.firstName;
    if (quest.lastName)
        res.lastName = quest.lastName;
    res.quest = quest;
    return res;
}
exports.questObstacle = questObstacle;
async function findOutcome(prng, guildId, obstacle, party, previousResults, provider) {
    if (typeof provider === "string") {
        provider = (0, newCheckpoint_1.makeProvider)(provider);
    }
    const obsInfo = sourceArrays_1.obstacleInfo[obstacle.type];
    if (!obsInfo) {
        throw new Error("No obstacle info");
    }
    const outcome = {
        success: interfaces_1.Success.failure,
        adjective: "",
        resolver: "",
        activity: prng.nextArrayItem(obsInfo.activities),
        obstacle,
        triggers: [],
        results: []
    };
    // reorganize results
    const processedResults = {};
    previousResults.forEach(result => {
        let advResults = processedResults[result.advId];
        if (!advResults) {
            advResults = {
                "INJURY": [],
                "KNOCKOUT": [],
                "DEATH": [],
                "LOOT": [],
                "SKILL": [],
                "TRAIT": [],
            };
        }
        advResults[result.type].push(result);
        processedResults[result.advId] = advResults;
    });
    let everyoneKnockedOut = false;
    let knockOutCount = 0;
    let successSum = 0;
    for (let i = 0; i < party.length; i++) {
        const adventurer = party[i];
        if (!adventurer) {
            throw new Error("No adventurer");
        }
        const advResults = processedResults[adventurer.id];
        let knockoutOrDeath = false;
        if (advResults) {
            // If an adventurer is knocked out or dead, skip them
            if (advResults[interfaces_1.ResultType.Knockout].length > 0) {
                knockOutCount += 1;
                if (knockOutCount === party.length) {
                    everyoneKnockedOut = true;
                }
                knockoutOrDeath = true;
            }
            if (advResults[interfaces_1.ResultType.Death].length > 0) {
                knockoutOrDeath = true;
            }
        }
        if (knockoutOrDeath === false) {
            let successRoll = prng.nextInt(1, 100);
            // Skill, loot, & trait triggers!
            Object.keys(sourceArrays_1.triggerMap).forEach(keyword => {
                let index = -1;
                (0, makeText_2.makeObstacleText)(obstacle).forEach(ls => {
                    const localIndex = ls.string.indexOf(keyword);
                    if (localIndex >= 0)
                        index = localIndex;
                });
                if (index >= 0) {
                    // console.log('found trigger keyword', makeObstacleText(obstacle), keyword, index)
                    const triggerInfos = sourceArrays_1.triggerMap[keyword];
                    if (!triggerInfos) {
                        throw new Error("No trigger infos");
                    }
                    triggerInfos.forEach(triggerInfo => {
                        const qualities = adventurer[triggerInfo.type];
                        if (!qualities) {
                            throw new Error("No adventurer qualities");
                        }
                        // doing it like this because keywords are subsets of loot strings
                        const hasName = qualities.join(" ").indexOf(triggerInfo.name);
                        // console.log('hasName', hasName, qualities.join(" "), triggerInfo)
                        if (hasName >= 0) {
                            const triggerRoll = prng.nextInt(1, 100);
                            if (triggerRoll <= triggerInfo.chance) {
                                console.log('rolled trigger!', triggerInfo, triggerRoll, adventurer);
                                // TODO add trigger text to makeText and get it into final results
                                successRoll += triggerInfo.modifier;
                                const text = (0, makeText_1.makeTriggerText)(triggerInfo, adventurer, sourceArrays_1.traits, qualities);
                                outcome.triggers.push({
                                    characterName: adventurer.name,
                                    triggeredComponent: triggerInfo.name,
                                    text
                                });
                            }
                        }
                    });
                }
            });
            let success = interfaces_1.Success.failure;
            if (10 < successRoll && successRoll <= 45 + 5 * obstacle.difficulty) {
                success = interfaces_1.Success.mixed;
            }
            else if (successRoll > 45 + 5 * obstacle.difficulty) {
                success = interfaces_1.Success.success;
            }
            successSum += success;
        }
    }
    // if everyone is knocked out, everyone dies and set successSum to 0
    if (everyoneKnockedOut) {
        // add a death result for everyone
        party.forEach(adv => {
            outcome.results.push({
                guildId,
                advName: adv.name,
                advId: adv.id,
                type: interfaces_1.ResultType.Death,
                text: (0, makeText_1.makeDeathText)(adv),
                component: ""
            });
        });
        // set successSum to 0
        successSum = 0;
    }
    if (successSum <= 3) {
        const adjectives = sourceArrays_1.activityAdjectives[interfaces_1.Success.failure];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives);
        if (obstacle.quest) {
            const questInfo = sourceArrays_1.questTypesAndInfo[obstacle.quest.type];
            if (!questInfo) {
                throw new Error("No quest info");
            }
            outcome.activity = prng.nextArrayItem(questInfo.activities);
            const resolver = prng.nextArrayItem(questInfo.resolvers)[1];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
        else {
            const resolver = prng.nextArrayItem(obsInfo.resolvers)[1];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
    }
    else if (successSum > 3 && successSum <= 7) {
        outcome.success = interfaces_1.Success.mixed;
        const adjectives = sourceArrays_1.activityAdjectives[interfaces_1.Success.mixed];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives);
        if (obstacle.quest) {
            const questInfo = sourceArrays_1.questTypesAndInfo[obstacle.quest.type];
            if (!questInfo) {
                throw new Error("No quest info");
            }
            outcome.activity = prng.nextArrayItem(questInfo.activities);
            const resolver = prng.nextArrayItem(questInfo.resolvers)[0];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
        else {
            const resolver = prng.nextArrayItem(obsInfo.resolvers)[0];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
    }
    else if (successSum > 7) {
        outcome.success = interfaces_1.Success.success;
        const adjectives = sourceArrays_1.activityAdjectives[interfaces_1.Success.success];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives);
        if (obstacle.quest) {
            const questInfo = sourceArrays_1.questTypesAndInfo[obstacle.quest.type];
            if (!questInfo) {
                throw new Error("No quest info");
            }
            outcome.activity = prng.nextArrayItem(questInfo.activities);
            const resolver = prng.nextArrayItem(questInfo.resolvers)[0];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
        else {
            const resolver = prng.nextArrayItem(obsInfo.resolvers)[0];
            if (!resolver) {
                throw new Error("No resolver");
            }
            outcome.resolver = resolver;
        }
    }
    // TODO awkward to have to loop through adventurers again here
    for (let i = 0; i < party.length; i++) {
        const adventurer = party[i];
        if (!adventurer) {
            throw new Error("No adventurer");
        }
        const advResults = processedResults[adventurer.id];
        let knockoutOrDeath = false;
        if (advResults) {
            // If an adventurer is knocked out or dead, skip them
            if (advResults[interfaces_1.ResultType.Knockout].length > 0 ||
                advResults[interfaces_1.ResultType.Death].length > 0) {
                knockoutOrDeath = true;
            }
        }
        if (knockoutOrDeath === false) {
            const results = await rollResults(prng, guildId, obstacle.difficulty, outcome.success, adventurer, provider, advResults);
            outcome.results = outcome.results.concat(results);
        }
    }
    return outcome;
}
exports.findOutcome = findOutcome;
// TODO move result text-making to be with the rest of the text
async function rollResults(prng, guildId, difficulty, success, adventurer, provider, previousResults) {
    const results = [];
    let length = 0;
    const lengthOdds = sourceArrays_1.numberOfResultsOdds[difficulty];
    if (!lengthOdds) {
        console.log(difficulty, sourceArrays_1.numberOfResultsOdds);
        throw new Error("No odds");
    }
    const zeroOdds = lengthOdds[0];
    const oneOdds = lengthOdds[1];
    const twoOdds = lengthOdds[2];
    if (!zeroOdds || !oneOdds || !twoOdds) {
        throw new Error("Incomplete odds");
    }
    const lengthRoll = prng.nextInt(1, 100);
    if (lengthRoll <= zeroOdds) {
        length = 0;
    }
    else if (lengthRoll > zeroOdds && lengthRoll <= oneOdds) {
        length = 1;
    }
    else if (lengthRoll > oneOdds && lengthRoll <= twoOdds) {
        length = 2;
    }
    else if (lengthRoll > twoOdds) {
        length = 3;
    }
    const typeOdds = sourceArrays_1.typeOfResultOdds[success];
    for (let i = 0; i < length; i++) {
        const result = {
            guildId,
            advName: adventurer.name,
            advId: adventurer.id,
            type: interfaces_1.ResultType.Injury,
            text: [],
            component: ""
        };
        const typeRoll = prng.nextInt(1, 100);
        // TODO prevent repeat injuries?
        if (typeRoll <= typeOdds["INJURY"]) {
            const injury = prng.nextArrayItem(sourceArrays_1.Injuries);
            result.text = (0, makeText_1.makeInjuryText)(adventurer, injury.text);
            result.component = prng.nextArrayItem(injury.traits);
            // if third injury, skip rest of results
            if (previousResults) {
                if (previousResults[interfaces_1.ResultType.Injury].length === 2)
                    i = length;
            }
        }
        else if (typeRoll > typeOdds["INJURY"] && typeRoll <= typeOdds["DEATH"]) {
            result.type = interfaces_1.ResultType.Death;
            result.text = (0, makeText_1.makeDeathText)(adventurer);
            // if they died, skip rest of results
            i = length;
        }
        else if (typeRoll > typeOdds["DEATH"] && typeRoll <= typeOdds["LOOT"]) {
            result.type = interfaces_1.ResultType.Loot;
            const lootPiece = await (0, loot_1.getRandomLootPiece)(prng, provider);
            result.component = lootPiece;
            result.text = (0, makeText_1.makeLootText)(adventurer, lootPiece);
            // TODO adventurers should not be able to get repeat skills
        }
        else if (typeRoll > typeOdds["LOOT"] && typeRoll <= typeOdds["SKILL"]) {
            result.type = interfaces_1.ResultType.Skill;
            const skill = prng.nextArrayItem(sourceArrays_1.skills);
            result.component = skill;
            result.text = (0, makeText_1.makeSkillText)(adventurer, skill);
            // TODO adventurers should not be able to get repeat traits
        }
        else if (typeRoll > typeOdds["SKILL"]) {
            result.type = interfaces_1.ResultType.Trait;
            const trait = prng.nextArrayItem(Object.keys(sourceArrays_1.traits));
            result.component = trait;
            result.text = (0, makeText_1.makeTraitText)(adventurer, trait);
        }
        results.push(result);
        // If this is the third injury, add a knockout result
        if (previousResults) {
            if (result.type === interfaces_1.ResultType.Injury && previousResults[interfaces_1.ResultType.Injury].length === 2) {
                results.push({
                    guildId,
                    advName: adventurer.name,
                    advId: adventurer.id,
                    type: interfaces_1.ResultType.Knockout,
                    text: (0, makeText_1.makeKnockoutText)(adventurer),
                    component: ""
                });
            }
        }
    }
    return results;
}
