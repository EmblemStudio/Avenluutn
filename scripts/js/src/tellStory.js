"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tellStory = void 0;
const prando_1 = require("prando");
const loot_1 = require("./content/loot");
const utils_1 = require("./utils");
const interfaces_1 = require("./content/interfaces");
// TODO no duplicate results for the same adventurer (can't bruise ribs twice, etc.)?
// TODO return results in a different list from story text, so they can be formatted differently by a front end?
async function tellStory(prng, state, startTime, length, guildId, provider) {
    const subSeed = prng.nextInt() + guildId;
    const subPrng = new prando_1.default(subSeed);
    const beginning = await tellBeginning(subPrng, state, startTime, length, guildId);
    const middle = await tellMiddle(guildId, state, beginning, provider);
    const ending = await tellEnding(guildId, beginning, middle, provider);
    let res = {
        plainText: [],
        richText: {
            beginning: beginning.text,
            middle: {
                obstacleText: middle.obstacleText,
                outcomeText: middle.outcomeText
            },
            ending: ending.text,
        },
        events: ending.results,
    };
    res.plainText = beginning.text;
    res.richText.middle.obstacleText.forEach((str, i) => {
        const outcomeText = res.richText.middle.outcomeText[i];
        if (outcomeText) {
            const strs = [
                str,
                outcomeText.main,
                ...outcomeText.results
            ];
            res.plainText = res.plainText.concat(strs);
        }
    });
    res.plainText = res.plainText.concat(ending.text);
    return res;
}
exports.tellStory = tellStory;
async function tellBeginning(prng, state, startTime, length, guildId
// provider: providers.BaseProvider
) {
    // Load guild
    const guild = state.guilds[guildId];
    if (!guild) {
        throw new Error("No guild");
    }
    /**
     * Make random party
     */
    const party = (0, utils_1.randomParty)(prng, prng.nextInt(3, 5), Object.keys(guild.adventurers)).party.map(id => {
        const adv = guild.adventurers[id];
        if (!adv) {
            throw new Error("No adventurer");
        }
        return adv;
    });
    let partyNames = "";
    party.forEach((a, i) => {
        if (i === party.length - 1) {
            partyNames += `and ${(0, loot_1.nameString)(a.name)}`;
        }
        else {
            partyNames += `${(0, loot_1.nameString)(a.name)}, `;
        }
    });
    const guildText = `At ${guild.name} in ${guild.location}, ${partyNames} have gathered.`;
    /**
     * Generate quest
     */
    const quest = (0, utils_1.randomQuest)(guildId, prng);
    const questText = (0, utils_1.makeQuestText)(quest);
    /**
     * Create obstacle times, outcome times, and end time
     *
     * TODO add the possibility of a boon in addition to obstacles
     */
    const endTime = startTime + length;
    const obstacleTimes = [];
    const outcomeTimes = [];
    const obstacleLength = Math.floor(length / (quest.difficulty + 1));
    const outcomeDelay = Math.floor(obstacleLength / 2);
    for (let i = 1; i <= quest.difficulty; i++) {
        const delay = obstacleLength * i;
        obstacleTimes.push(startTime + delay);
        outcomeTimes.push(startTime + delay + outcomeDelay);
    }
    return {
        guild,
        party,
        quest,
        endTime,
        obstacleTimes,
        outcomeTimes,
        text: [guildText, questText]
    };
}
async function tellMiddle(guildId, state, beginning, provider) {
    const middle = {
        questSuccess: interfaces_1.Success.failure,
        obstacles: [],
        outcomes: [],
        allResults: [],
        obstacleText: [],
        outcomeText: []
    };
    let allOutcomesSucceeded = true;
    for (let i = 0; i < beginning.obstacleTimes.length; i++) {
        console.log("Ob", i);
        if (allOutcomesSucceeded) {
            const obstacleTime = beginning.obstacleTimes[i];
            if (!obstacleTime) {
                throw new Error("No obstacle time");
            }
            const obstacleHash = await (0, utils_1.nextBlockHash)(obstacleTime, provider);
            console.log("Ob hash", obstacleHash);
            if (obstacleHash) {
                const obsSeed = obstacleHash + guildId;
                console.log("obstacle seed", obsSeed);
                const obsPrng = new prando_1.default(obstacleHash);
                if (i + 1 === beginning.obstacleTimes.length) {
                    const obstacle = (0, utils_1.questObstacle)(obsPrng, beginning.quest);
                    middle.obstacles.push(obstacle);
                    middle.obstacleText.push((0, utils_1.makeObstacleText)(obstacle));
                }
                else {
                    console.log("getting random ob");
                    const obstacle = (0, utils_1.randomObstacle)(obsPrng, i + 1);
                    console.log("got random ob", obstacle);
                    middle.obstacles.push(obstacle);
                    middle.obstacleText.push((0, utils_1.makeObstacleText)(obstacle));
                    console.log("got obstacle text", middle.obstacleText);
                }
            }
            const outcomeTime = beginning.outcomeTimes[i];
            if (!outcomeTime) {
                throw new Error("No outcome time");
            }
            console.log("getting next block hash");
            const outcomeHash = await (0, utils_1.nextBlockHash)(outcomeTime, provider);
            console.log("outcome hash", outcomeHash);
            const obstacle = middle.obstacles[i];
            if (obstacle && outcomeHash) {
                const outcomeSeed = outcomeHash + guildId;
                const outPrng = new prando_1.default(outcomeSeed);
                console.log("finding outcome");
                const outcome = await (0, utils_1.findOutcome)(outPrng, beginning.guild.id, obstacle, beginning.party, middle.allResults, provider);
                console.log(outcome);
                if (outcome.success === interfaces_1.Success.failure)
                    allOutcomesSucceeded = false;
                if (i + 1 === beginning.obstacleTimes.length)
                    middle.questSuccess = outcome.success;
                middle.outcomes.push(outcome);
                middle.allResults = [...middle.allResults, ...outcome.results];
                // TODO outcome text should differentiate between main text and results text for UI purposes
                middle.outcomeText = [...middle.outcomeText, (0, utils_1.makeOutcomeText)(outcome)];
                console.log("outcome text", middle.outcomeText);
            }
        }
    }
    return middle;
}
async function tellEnding(guildId, beginning, middle, provider) {
    /**
     * check if everyone died
     * --> everyone died ending
     * check if injuries become traits
     * --> get rid of injury results, add new trait results
     * check overall success level
     * create end text: [adv names] returned to [guild name] [triumphantly / in disgrace]. [if treasure] [Treasure] was added to the guild vault.
     */
    console.log("telling ending", guildId);
    const ending = {
        results: [],
        text: [""]
    };
    // TODO check that this is after the quest is finished, not at the same time
    const endingHash = await (0, utils_1.nextBlockHash)(beginning.endTime, provider);
    let deathCount = 0;
    let everyoneDied = false;
    let oneLeft = false;
    if (endingHash) {
        const endingSeed = endingHash + guildId;
        console.log("ending seed", endingSeed);
        const prng = new prando_1.default(endingSeed);
        for (let i = 0; i < middle.allResults.length; i++) {
            const result = middle.allResults[i];
            if (!result) {
                throw new Error("No result");
            }
            if (result.type === interfaces_1.ResultType.Death) {
                deathCount += 1;
                if (deathCount === beginning.party.length)
                    everyoneDied = true;
                if (deathCount === beginning.party.length - 1)
                    oneLeft = true;
            }
            if (result.type !== interfaces_1.ResultType.Injury) {
                ending.results.push(result);
            }
            else {
                const roll = prng.nextInt(1, 100);
                if (roll <= 5) {
                    const newResult = {
                        guildId: beginning.guild.id,
                        advName: result.advName,
                        advId: result.advId,
                        type: interfaces_1.ResultType.Trait,
                        text: `${(0, loot_1.nameString)(result.advName)} now has ${result.component}.`,
                        component: result.component
                    };
                    ending.results.push(newResult);
                    ending.text.push(newResult.text);
                }
            }
        }
    }
    if (everyoneDied) {
        ending.text[0] = `None who set out returned alive.`;
    }
    else {
        if (oneLeft) {
            ending.text[0] += `The last adventurer `;
        }
        else {
            ending.text[0] += `The adventurers `;
        }
        if (middle.questSuccess === interfaces_1.Success.failure) {
            ending.text[0] += `slunk back to ${beginning.guild.name} in disgrace.`;
        }
        else if (middle.questSuccess === interfaces_1.Success.mixed) {
            ending.text[0] += `returned to ${beginning.guild.name}, exhausted but successful.`;
        }
        else if (middle.questSuccess === interfaces_1.Success.success) {
            ending.text[0] += `returned triumphantly to ${beginning.guild.name}, basking in glory.`;
        }
    }
    return ending;
}
