"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tellStory = void 0;
const utils_1 = require("./utils");
// TODO no duplicate results for the same adventurer (can't bruise ribs twice, etc.)?
async function tellStory(runStart, prng, state, startTime, length, guildId, provider) {
    const beginning = await tellBeginning(prng, state, startTime, length, guildId);
    if (beginning.party.length < 3) {
        const res = {
            party: beginning.party,
            plainText: [],
            richText: {
                beginning: beginning.text,
                middle: {
                    obstacleText: [],
                    outcomeText: []
                },
                ending: { main: [], resultTexts: [] },
            },
            events: [],
            finalOutcome: utils_1.Success.failure,
            nextUpdateTime: (0, utils_1.findNextUpdateTime)(runStart, [startTime, ...beginning.outcomeTimes, ...beginning.obstacleTimes, beginning.endTime], true)
        };
        return res;
    }
    const middle = await tellMiddle(runStart, guildId, state, beginning, provider);
    const ending = await tellEnding(runStart, guildId, beginning, middle, state, provider);
    const res = {
        party: beginning.party,
        plainText: [],
        richText: {
            beginning: beginning.text,
            middle: {
                obstacleText: middle.obstacleText,
                outcomeText: middle.outcomeText
            },
            ending: ending.text,
        },
        events: [...middle.allResults, ...ending.results],
        finalOutcome: middle.questSuccess,
        nextUpdateTime: (0, utils_1.findNextUpdateTime)(runStart, [startTime, ...beginning.outcomeTimes, ...beginning.obstacleTimes, beginning.endTime], middle.allOutcomesSucceeded)
    };
    // make plainText
    res.richText.beginning.resurrections.forEach(lsa => lsa.forEach(ls => res.plainText.push(ls.string)));
    res.richText.beginning.main.forEach(ls => res.plainText.push(ls.string));
    res.richText.middle.obstacleText.forEach((lsa, i) => {
        const outcomeText = res.richText.middle.outcomeText[i];
        if (outcomeText) {
            const strs = [
                ...lsa.map(ls => ls.string),
                ...outcomeText.main.map(ls => ls.string)
            ];
            outcomeText.triggerTexts.forEach(lsa => {
                lsa.forEach(ls => strs.push(ls.string));
            });
            outcomeText.resultTexts.forEach(lsa => {
                lsa.forEach(ls => strs.push(ls.string));
            });
            res.plainText.push(...strs);
        }
    });
    ending.text.main.forEach(ls => res.plainText.push(ls.string));
    ending.text.resultTexts.forEach(lsa => {
        lsa.forEach(ls => res.plainText.push(ls.string));
    });
    return res;
}
exports.tellStory = tellStory;
async function tellBeginning(prng, state, startTime, length, guildId
// provider: providers.BaseProvider
) {
    // const prng = new Prando(seed)
    // Load guild
    console.log('trying to load guild:', state.guilds, guildId);
    const guild = state.guilds[guildId];
    if (!guild) {
        throw new Error("No guild");
    }
    /**
     * Make random party
     */
    const randomPartyRes = (0, utils_1.randomParty)(prng, prng.nextInt(3, 5), Object.keys(guild.adventurers), Object.keys(guild.graveyard));
    const resurrectionTexts = [];
    randomPartyRes.rareParty.forEach(id => {
        const adv = guild.graveyard[id];
        if (adv !== undefined) {
            // change them into a thrall
            adv.species = ["Thrall"];
            // remove them from the graveyard
            guild.adventurers[id] = adv;
            delete guild.graveyard[id];
            // add some text about them being resurrected
            resurrectionTexts.push((0, utils_1.makeResurrectionText)(adv));
        }
    });
    const party = randomPartyRes.party.map(id => {
        const adv = guild.adventurers[id];
        if (!adv) {
            throw new Error("No adventurer");
        }
        return adv;
    });
    const guildText = (0, utils_1.makeGuildText)(guild, party);
    /**
     * Generate quest
     */
    const quest = (0, utils_1.randomQuest)(guildId, prng);
    let questText = [];
    if (party.length >= 3) {
        questText = (0, utils_1.makeQuestText)(quest);
    }
    /**
     * Create obstacle times, outcome times, and end time
     *
     * TODO add the possibility of a boon in addition to obstacles
     */
    const endTime = startTime + length;
    const obstacleTimes = [];
    const outcomeTimes = [];
    const obstacleLength = length / (quest.difficulty + 1);
    const outcomeDelay = obstacleLength / 2;
    for (let i = 1; i <= quest.difficulty; i++) {
        const delay = obstacleLength * i;
        obstacleTimes.push(Math.floor(startTime + delay));
        outcomeTimes.push(Math.floor(startTime + delay + outcomeDelay));
        console.log('i, diff', i, quest.difficulty);
    }
    console.log('quest diff', quest.difficulty, quest.difficulty + 1);
    console.log('story length', length);
    console.log('obstacle length and outcome delay', obstacleLength, outcomeDelay);
    console.log('times', startTime, obstacleTimes, outcomeTimes, endTime);
    return {
        guild,
        party,
        quest,
        endTime,
        obstacleTimes,
        outcomeTimes,
        text: {
            resurrections: resurrectionTexts,
            main: [...guildText, ...questText]
        }
    };
}
async function tellMiddle(runStart, guildId, state, beginning, provider) {
    const middle = {
        questSuccess: utils_1.Success.failure,
        obstacles: [],
        outcomes: [],
        allResults: [],
        obstacleText: [],
        outcomeText: [],
        allOutcomesSucceeded: true
    };
    for (let i = 0; i < beginning.obstacleTimes.length; i++) {
        if (middle.allOutcomesSucceeded) {
            const obstacleTime = beginning.obstacleTimes[i];
            if (!obstacleTime) {
                throw new Error("No obstacle time");
            }
            let checkpoint = await (0, utils_1.newCheckpoint)(runStart, obstacleTime, provider, `${guildId}`);
            if (!checkpoint.error) {
                if (i + 1 === beginning.obstacleTimes.length) {
                    const obstacle = (0, utils_1.questObstacle)(checkpoint.prng, beginning.quest);
                    middle.obstacles.push(obstacle);
                    middle.obstacleText.push((0, utils_1.makeObstacleText)(obstacle, beginning.party, middle.allResults));
                }
                else {
                    const obstacle = (0, utils_1.randomObstacle)(checkpoint.prng, i + 2);
                    middle.obstacles.push(obstacle);
                    middle.obstacleText.push((0, utils_1.makeObstacleText)(obstacle, beginning.party, middle.allResults));
                }
            }
            const outcomeTime = beginning.outcomeTimes[i];
            if (!outcomeTime) {
                throw new Error("No outcome time");
            }
            checkpoint = await (0, utils_1.newCheckpoint)(runStart, outcomeTime, provider, `${guildId}`);
            const obstacle = middle.obstacles[i];
            if (!checkpoint.error && obstacle) {
                const outcome = await (0, utils_1.findOutcome)(checkpoint.prng, beginning.guild.id, obstacle, beginning.party, middle.allResults, provider);
                if (outcome.success === utils_1.Success.failure)
                    middle.allOutcomesSucceeded = false;
                if (i + 1 === beginning.obstacleTimes.length)
                    middle.questSuccess = outcome.success;
                middle.outcomes.push(outcome);
                middle.allResults = [...middle.allResults, ...outcome.results];
                middle.outcomeText = [...middle.outcomeText, (0, utils_1.makeOutcomeText)(outcome, beginning.party, middle.allResults)];
            }
        }
    }
    return middle;
}
async function tellEnding(runStart, guildId, beginning, middle, state, provider) {
    /**
     * check if everyone died
     * --> everyone died ending
     * check if injuries become traits
     * --> get rid of injury results, add new trait results
     * check overall success level
     * create end text: [adv names] returned to [guild name] [triumphantly / in disgrace]. [if treasure] [Treasure] was added to the guild vault.
     */
    const ending = {
        results: [],
        text: {
            main: [],
            resultTexts: []
        }
    };
    const checkpoint = await (0, utils_1.newCheckpoint)(runStart, beginning.endTime, provider, `${guildId}`);
    let deathCount = 0;
    let everyoneDied = false;
    let oneLeft = false;
    if (!checkpoint.error) {
        for (let i = 0; i < middle.allResults.length; i++) {
            const result = middle.allResults[i];
            if (!result) {
                throw new Error("No result");
            }
            if (result.type === utils_1.ResultType.Death) {
                deathCount += 1;
                if (deathCount === beginning.party.length)
                    everyoneDied = true;
                if (deathCount === beginning.party.length - 1)
                    oneLeft = true;
            }
            if (result.type === utils_1.ResultType.Injury) {
                const roll = checkpoint.prng.nextInt(1, 100);
                if (roll <= 5) {
                    const guild = state.guilds[guildId];
                    if (guild) {
                        const adv = guild.adventurers[result.advId];
                        if (adv) {
                            const newResult = {
                                guildId: beginning.guild.id,
                                advName: result.advName,
                                advId: result.advId,
                                type: utils_1.ResultType.Trait,
                                text: (0, utils_1.makeTraitText)(adv, result.component),
                                component: result.component
                            };
                            ending.results.push(newResult);
                        }
                    }
                }
            }
        }
        ending.text = (0, utils_1.makeEndingText)(beginning, middle, everyoneDied, oneLeft, ending.results);
    }
    return ending;
}
