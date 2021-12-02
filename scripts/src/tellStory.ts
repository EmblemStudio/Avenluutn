import Prando from 'prando'
import { providers } from 'ethers'

import { nameString } from './content/loot'
import {
  randomQuest,
  randomObstacle,
  questObstacle,
  findOutcome,
  makeQuestText,
  makeObstacleText,
  makeOutcomeText,
  OutcomeText,
  nextBlockHash,
  randomParty
} from './utils'
import {
  State,
  Adventurer,
  Quest,
  Obstacle,
  Outcome,
  Result,
  Success,
  ResultType,
  Guild
} from './content/interfaces'

export interface Story {
  plainText: string[];
  richText: {
    beginning: string[];
    middle: {
      obstacleText: string[];
      outcomeText: OutcomeText[];
    };
    ending: string[];
  }
  events: Result[];
}

// TODO no duplicate results for the same adventurer (can't bruise ribs twice, etc.)?
// TODO return results in a different list from story text, so they can be formatted differently by a front end?
export async function tellStory(
  seed: string, //prng: Prando,
  state: State,
  startTime: number,
  length: number,
  guildId: number,
  provider: providers.BaseProvider
): Promise<Story> {
  const beginning = await tellBeginning(
    seed,
    state,
    startTime,
    length,
    guildId
  )
  const middle = await tellMiddle(
    guildId,
    state,
    beginning,
    provider
  )
  const ending = await tellEnding(
    guildId,
    beginning,
    middle,
    provider
  )
  let res: Story = {
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
  }
  res.plainText = beginning.text
  res.richText.middle.obstacleText.forEach((str, i) => {
    const outcomeText = res.richText.middle.outcomeText[i]
    if (outcomeText) {
      const strs = [
        str,
        outcomeText.main,
        ...outcomeText.results
      ]
      res.plainText = res.plainText.concat(strs)
    }
  })
  res.plainText = res.plainText.concat(ending.text)
  return res
}

interface Beginning {
  guild: Guild;
  party: Adventurer[];
  quest: Quest;
  endTime: number;
  obstacleTimes: number[];
  outcomeTimes: number[];
  text: string[];
}

async function tellBeginning(
  seed: string, // prng: Prando,
  state: State,
  startTime: number,
  length: number,
  guildId: number
  // provider: providers.BaseProvider
): Promise<Beginning> {
  const prng = new Prando(seed)
  // Load guild
  const guild = state.guilds[guildId]
  if (!guild) { throw new Error("No guild") }
  /**
   * Make random party
   */
  const party: Adventurer[] = randomParty(
    prng,
    prng.nextInt(3, 5),
    Object.keys(guild.adventurers)
  ).party.map(id => {
    const adv = guild.adventurers[id]
    if (!adv) { throw new Error("No adventurer") }
    return adv
  })
  let partyNames = ""
  party.forEach((a, i) => {
    if (i === party.length - 1) {
      partyNames += `and ${nameString(a.name)}`
    } else {
      partyNames += `${nameString(a.name)}, `
    }
  })
  const guildText = `At ${guild.name} in ${guild.location}, ${partyNames} have gathered.`

  /**
   * Generate quest
   */
  const quest = randomQuest(guildId, prng)
  const questText = makeQuestText(quest)

  /**
   * Create obstacle times, outcome times, and end time
   *
   * TODO add the possibility of a boon in addition to obstacles
   */
  const endTime = startTime + length
  const obstacleTimes = []
  const outcomeTimes = []
  const obstacleLength = Math.floor(length / (quest.difficulty + 1))
  const outcomeDelay = Math.floor(obstacleLength / 2)
  for(let i = 1; i <= quest.difficulty; i++) {
    const delay = obstacleLength * i
    obstacleTimes.push(startTime + delay)
    outcomeTimes.push(startTime + delay + outcomeDelay)
  }

  return {
    guild,
    party,
    quest,
    endTime,
    obstacleTimes,
    outcomeTimes,
    text: [guildText, questText]
  }
}

interface Middle {
  questSuccess: Success;
  obstacles: Obstacle[];
  outcomes: Outcome[];
  allResults: Result[];
  obstacleText: string[];
  outcomeText: OutcomeText[];
}

async function tellMiddle(
  guildId: number,
  state: State,
  beginning: Beginning,
  provider: providers.BaseProvider
): Promise<Middle> {
  const middle: Middle = {
    questSuccess: Success.failure,
    obstacles: [],
    outcomes: [],
    allResults: [],
    obstacleText: [],
    outcomeText: []
  }
  let allOutcomesSucceeded = true
  for(let i = 0; i < beginning.obstacleTimes.length; i++) {
    if (allOutcomesSucceeded) {
      const obstacleTime = beginning.obstacleTimes[i]
      if (!obstacleTime) { throw new Error("No obstacle time") }

      const obstacleHash = await nextBlockHash(obstacleTime, provider)
      if (obstacleHash !== null) {
        const obsSeed = obstacleHash + guildId + i
        const obsPrng = new Prando(obsSeed)
        if (i + 1 === beginning.obstacleTimes.length) {
          const obstacle = questObstacle(obsPrng, beginning.quest)
          middle.obstacles.push(obstacle)
          middle.obstacleText.push(makeObstacleText(obstacle))
        } else {
          const obstacle = randomObstacle(obsPrng, i + 1)
          middle.obstacles.push(obstacle)
          middle.obstacleText.push(makeObstacleText(obstacle))
        }
      }

      const outcomeTime = beginning.outcomeTimes[i]
      if (!outcomeTime) { throw new Error("No outcome time") }
      const outcomeHash = await nextBlockHash(outcomeTime, provider)
      const obstacle = middle.obstacles[i]
      if (obstacle && outcomeHash) {
        const outcomeSeed = outcomeHash + guildId + i
        const outPrng = new Prando(outcomeSeed)
        const outcome = await findOutcome(
          outPrng,
          beginning.guild.id,
          obstacle,
          beginning.party,
          middle.allResults,
          provider
        )
        if (outcome.success === Success.failure) allOutcomesSucceeded = false
        if (i + 1 === beginning.obstacleTimes.length) middle.questSuccess = outcome.success
        middle.outcomes.push(outcome)
        middle.allResults = [...middle.allResults, ...outcome.results]
        // TODO outcome text should differentiate between main text and results text for UI purposes
        middle.outcomeText = [...middle.outcomeText, makeOutcomeText(outcome)]
      }
    }
  }

  return middle
}

interface Ending {
  results: Result[];
  text: string[];
}

async function tellEnding(
  guildId: number,
  beginning: Beginning,
  middle: Middle,
  provider: providers.BaseProvider
): Promise<Ending> {
  /**
   * check if everyone died
   * --> everyone died ending
   * check if injuries become traits
   * --> get rid of injury results, add new trait results
   * check overall success level
   * create end text: [adv names] returned to [guild name] [triumphantly / in disgrace]. [if treasure] [Treasure] was added to the guild vault.
   */
  const ending: Ending = {
    results: [],
    text: [""]
  }

  // TODO check that this is after the quest is finished, not at the same time
  const endingHash = await nextBlockHash(beginning.endTime, provider)

  let deathCount = 0
  let everyoneDied = false
  let oneLeft = false

  if (endingHash) {
    const endingSeed = endingHash + guildId
    const prng = new Prando(endingSeed)

    for (let i = 0; i < middle.allResults.length; i++) {
      const result = middle.allResults[i]
      if (!result) { throw new Error("No result") }

      if (result.type === ResultType.Death) {
        deathCount += 1
        if (deathCount === beginning.party.length) everyoneDied = true
        if (deathCount === beginning.party.length - 1) oneLeft = true
      }

      if (result.type !== ResultType.Injury) {
        ending.results.push(result)
      } else {
        const roll = prng.nextInt(1, 100)
        if (roll <= 5) {
          const newResult = {
            guildId: beginning.guild.id,
            advName: result.advName,
            advId: result.advId,
            type: ResultType.Trait,
            text: `${nameString(result.advName)} now has ${result.component}.`,
            component: result.component
          }
          ending.results.push(newResult)
          ending.text.push(newResult.text)
        }
      }
    }
  }

  if (everyoneDied) {
    ending.text[0] = `None who set out returned alive.`
  } else {
    if (oneLeft) {
      ending.text[0] += `The last adventurer `
    } else {
      ending.text[0] += `The adventurers `
    }
    if (middle.questSuccess === Success.failure) {
      ending.text[0] += `slunk back to ${beginning.guild.name} in disgrace.`
    } else if (middle.questSuccess === Success.mixed) {
      ending.text[0] += `returned to ${beginning.guild.name}, exhausted but successful.`
    } else if (middle.questSuccess === Success.success) {
      ending.text[0] += `returned triumphantly to ${beginning.guild.name}, basking in glory.`
    }
  }

  return ending
}
