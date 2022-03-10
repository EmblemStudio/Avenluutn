"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOutcome = exports.questObstacle = exports.randomObstacle = exports.randomQuest = void 0;
const interfaces_1 = require("./interfaces");
const originalContent_1 = require("../content/original/originalContent");
const makeText_1 = require("./makeText");
const processResults_1 = require("./processResults");
const loot_1 = require("../content/loot");
const makeText_2 = require("./makeText");
const newCheckpoint_1 = require("./newCheckpoint");
// 1 = verb, objective, location / 2 = verb, adj, obj, loc, 3 = ver, adj, adj, obj, loc, 4 = ver, adj, adj, name, obj, loc
// TODO adjust the RNG so characters are more likely to "select" quests that fit them?
function randomQuest(guildId, prng) {
    const type = prng.nextArrayItem(originalContent_1.QuestType);
    const activities = originalContent_1.questActivities[type];
    if (!activities) {
        throw new Error("No quest activities");
    }
    const objectives = originalContent_1.questObjectives[type];
    if (!objectives) {
        throw new Error("No quest objectives");
    }
    const positiveResolvers = originalContent_1.questPositiveResolvers[type];
    if (!positiveResolvers) {
        throw new Error("No quest positiveResolvers");
    }
    const negativeResolvers = originalContent_1.questNegativeResolvers[type];
    if (!negativeResolvers) {
        throw new Error("No quest negativeResolvers");
    }
    // const questInfo = questTypesAndInfo[type]
    // if (!questInfo) { throw new Error("No quest info") }
    const res = {
        guildId,
        difficulty: prng.nextArrayItem(originalContent_1.questDifficulty),
        type,
        objective: prng.nextArrayItem(objectives).objective,
        locationName: prng.nextArrayItem(originalContent_1.questLocationName),
        locationType: prng.nextArrayItem(originalContent_1.questLocationType)
    };
    if (res.difficulty > 1) {
        res.firstAdjective = prng.nextArrayItem(originalContent_1.genericFirstAdjectives);
    }
    if (res.difficulty > 2) {
        res.secondAdjective = prng.nextArrayItem(originalContent_1.genericSecondAdjectives);
    }
    if (res.difficulty > 3) {
        res.firstName = prng.nextArrayItem(originalContent_1.genericFirstName);
        res.lastName = prng.nextArrayItem(originalContent_1.genericLastName);
    }
    return res;
}
exports.randomQuest = randomQuest;
function randomObstacle(prng, difficulty) {
    // TODO use an enum for difficulty in randomObstacle
    if (![2, 3, 4, 5].includes(difficulty)) {
        throw new Error("Difficulty must be 2, 3, 4, or 5");
    }
    const type = prng.nextArrayItem(originalContent_1.ObstacleType);
    const discoveries = originalContent_1.obstacleDiscoveries[type];
    if (!discoveries) {
        throw new Error("No obstacle discoveries");
    }
    const objects = originalContent_1.obstacleObjects[type];
    if (!objects) {
        throw new Error("No obstacle objects");
    }
    const res = {
        difficulty,
        type,
        arrival: prng.nextArrayItem(originalContent_1.obstacleArrivals),
        discovery: prng.nextArrayItem(discoveries).discovery,
        object: prng.nextArrayItem(objects).object,
        // additions: [] TODO additions
    };
    if (res.difficulty > 1) {
        res.firstAdjective = prng.nextArrayItem(originalContent_1.genericFirstAdjectives);
    }
    if (res.difficulty > 2) {
        res.secondAdjective = prng.nextArrayItem(originalContent_1.genericSecondAdjectives);
    }
    if (res.difficulty > 3) {
        res.firstName = prng.nextArrayItem(originalContent_1.genericFirstName);
        res.lastName = prng.nextArrayItem(originalContent_1.genericLastName);
    }
    return res;
}
exports.randomObstacle = randomObstacle;
function questObstacle(prng, quest) {
    const goal = quest.type.toUpperCase();
    const typeArray = originalContent_1.questObstacleMap[goal];
    if (!typeArray) {
        throw new Error("No typeArray");
    }
    const typeObj = typeArray[0];
    if (!typeObj) {
        throw new Error("No type obj");
    }
    const type = typeObj.obstacleType;
    if (type === goal) {
        return randomObstacle(prng, quest.difficulty);
    }
    const discoveries = originalContent_1.obstacleDiscoveries[type];
    if (!discoveries) {
        throw new Error("No obstacle discoveries");
    }
    const res = {
        difficulty: quest.difficulty,
        type,
        arrival: prng.nextArrayItem(originalContent_1.obstacleArrivals),
        discovery: prng.nextArrayItem(discoveries).discovery,
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
    const activities = originalContent_1.obstacleActivities[obstacle.type];
    if (!activities) {
        throw new Error("No obstacle activities");
    }
    const outcome = {
        success: interfaces_1.Success.failure,
        adjective: "",
        resolver: "",
        activity: prng.nextArrayItem(activities).activity,
        obstacle,
        triggers: [],
        results: []
    };
    // reorganize results
    const processedResults = (0, processResults_1.processResults)(previousResults);
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
            Object.keys(originalContent_1.triggerMap).forEach(keyword => {
                let index = -1;
                (0, makeText_2.makeObstacleText)(obstacle, party, previousResults).forEach(ls => {
                    const localIndex = ls.string.indexOf(keyword);
                    if (localIndex >= 0)
                        index = localIndex;
                });
                if (index >= 0) {
                    // console.log('found trigger keyword', makeObstacleText(obstacle), keyword, index)
                    const triggerInfos = originalContent_1.triggerMap[keyword];
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
                                // TODO add trigger text to makeText and get it into final results
                                successRoll += triggerInfo.modifier;
                                const text = (0, makeText_1.makeTriggerText)(triggerInfo, adventurer, originalContent_1.traits, qualities);
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
        const adjectives = originalContent_1.activityAdjectives["FAILURE"];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives).text;
        if (obstacle.quest) {
            const activities = originalContent_1.questActivities[obstacle.quest.type];
            if (!activities) {
                throw new Error("No quest activities");
            }
            outcome.activity = prng.nextArrayItem(activities).activity;
            const resolvers = originalContent_1.questNegativeResolvers[obstacle.quest.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).negativeResolver;
        }
        else {
            const resolvers = originalContent_1.obstacleNegativeResolvers[obstacle.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).negativeResolver;
        }
    }
    else if (successSum > 3 && successSum <= 7) {
        outcome.success = interfaces_1.Success.mixed;
        const adjectives = originalContent_1.activityAdjectives["MIXED"];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives).text;
        if (obstacle.quest) {
            /*
            const questInfo = questTypesAndInfo[obstacle.quest.type]
            if (!questInfo) { throw new Error("No quest info") }
            outcome.activity = prng.nextArrayItem(questInfo.activities)
            const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
            if (!resolver) { throw new Error("No resolver") }
            outcome.resolver = resolver
            */
            const activities = originalContent_1.questActivities[obstacle.quest.type];
            if (!activities) {
                throw new Error("No quest activities");
            }
            outcome.activity = prng.nextArrayItem(activities).activity;
            const resolvers = originalContent_1.questPositiveResolvers[obstacle.quest.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver;
        }
        else {
            /*
            const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
            if (!resolver) { throw new Error("No resolver") }
            outcome.resolver = resolver
            */
            const resolvers = originalContent_1.obstaclePositiveResolvers[obstacle.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver;
        }
    }
    else if (successSum > 7) {
        outcome.success = interfaces_1.Success.success;
        const adjectives = originalContent_1.activityAdjectives["SUCCESS"];
        if (!adjectives) {
            throw new Error("No adjectives");
        }
        outcome.adjective = prng.nextArrayItem(adjectives).text;
        if (obstacle.quest) {
            /*
            const questInfo = questTypesAndInfo[obstacle.quest.type]
            if (!questInfo) { throw new Error("No quest info") }
            outcome.activity = prng.nextArrayItem(questInfo.activities)
            const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
            if (!resolver) { throw new Error("No resolver") }
            outcome.resolver = resolver
            */
            const activities = originalContent_1.questActivities[obstacle.quest.type];
            if (!activities) {
                throw new Error("No quest activities");
            }
            outcome.activity = prng.nextArrayItem(activities).activity;
            const resolvers = originalContent_1.questPositiveResolvers[obstacle.quest.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver;
        }
        else {
            /*
            const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
            if (!resolver) { throw new Error("No resolver") }
            outcome.resolver = resolver
            */
            const resolvers = originalContent_1.obstaclePositiveResolvers[obstacle.type];
            if (!resolvers) {
                throw new Error("No quest resolvers");
            }
            outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver;
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
async function rollResults(prng, guildId, difficulty, success, adventurer, provider, previousResults) {
    const results = [];
    let length = 0;
    const oddsArray = originalContent_1.numberOfResultsOdds[difficulty];
    if (oddsArray === undefined)
        throw new Error("No oddsArray");
    const lengthOdds = oddsArray[0];
    if (lengthOdds === undefined)
        throw new Error("No odds");
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
    const successStr = originalContent_1.SuccessType[success];
    if (successStr === undefined)
        throw new Error("No success string");
    const typeOddsArray = originalContent_1.typeOfResultOdds[successStr];
    if (typeOddsArray === undefined)
        throw new Error("No type odds array");
    const typeOdds = typeOddsArray[0];
    if (typeOdds === undefined)
        throw new Error("No type odds");
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
        const injuryOdds = typeOdds["INJURY"];
        if (injuryOdds === undefined)
            throw new Error("No injuryOdds");
        const deathOdds = typeOdds["DEATH"];
        if (deathOdds === undefined)
            throw new Error("No deathOdds");
        const lootOdds = typeOdds["LOOT"];
        if (lootOdds === undefined)
            throw new Error("No lootOdds");
        const skillOdds = typeOdds["SKILL"];
        if (skillOdds === undefined)
            throw new Error("No skillOdds");
        if (typeRoll <= injuryOdds) {
            const injuryText = prng.nextArrayItem(Object.keys(originalContent_1.injuries));
            result.text = (0, makeText_1.makeInjuryText)(adventurer, injuryText);
            const injury = originalContent_1.injuries[injuryText];
            if (injury === undefined)
                throw new Error("No injury");
            result.component = prng.nextArrayItem(injury).trait;
            results.push(result);
            // if third injury, skip rest of results
            if (previousResults) {
                if (previousResults[interfaces_1.ResultType.Injury].length === 2)
                    i = length;
            }
        }
        else if (typeRoll > injuryOdds && typeRoll <= deathOdds) {
            result.type = interfaces_1.ResultType.Death;
            result.text = (0, makeText_1.makeDeathText)(adventurer);
            results.push(result);
            // if they died, skip rest of results
            i = length;
        }
        else if (typeRoll > deathOdds && typeRoll <= lootOdds) {
            result.type = interfaces_1.ResultType.Loot;
            const lootPiece = await (0, loot_1.getRandomLootPiece)(prng, provider);
            result.component = lootPiece;
            result.text = (0, makeText_1.makeLootText)(adventurer, lootPiece);
            results.push(result);
        }
        else if (typeRoll > lootOdds && typeRoll <= skillOdds) {
            result.type = interfaces_1.ResultType.Skill;
            const skill = prng.nextArrayItem(originalContent_1.skills);
            if (!adventurer.skills.includes(skill)) {
                result.component = skill;
                result.text = (0, makeText_1.makeSkillText)(adventurer, skill);
                results.push(result);
            }
        }
        else if (typeRoll > skillOdds) {
            result.type = interfaces_1.ResultType.Trait;
            const trait = prng.nextArrayItem(Object.keys(originalContent_1.traits));
            if (!adventurer.traits.includes(trait)) {
                result.component = trait;
                result.text = (0, makeText_1.makeTraitText)(adventurer, trait);
                results.push(result);
            }
        }
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
