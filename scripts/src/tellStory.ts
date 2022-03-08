import Prando from 'prando'
import { providers } from 'ethers'

import {
  randomQuest,
  randomObstacle,
  questObstacle,
  findOutcome,
  makeGuildText,
  makeQuestText,
  makeObstacleText,
  makeOutcomeText,
  makeEndingText,
  randomParty,
  newCheckpoint,
  Story,
  Beginning,
  Middle,
  Ending,
  State,
  Adventurer,
  Success,
  Result,
  ResultType,
  makeTraitText,
  findNextUpdateTime,
  LabeledString
} from './utils'

// TODO no duplicate results for the same adventurer (can't bruise ribs twice, etc.)?
export async function tellStory(
  runStart: number,
  prng: Prando,
  state: State,
  startTime: number,
  length: number,
  guildId: number,
  provider: providers.BaseProvider
): Promise<Story> {
  const beginning = await tellBeginning(
    prng,
    state,
    startTime,
    length,
    guildId
  )
  if (beginning.party.length < 3) {
    const res = {
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
      finalOutcome: Success.failure,
      nextUpdateTime: findNextUpdateTime(
        runStart,
        [startTime, ...beginning.outcomeTimes, ...beginning.obstacleTimes, beginning.endTime],
        true
      )
    }
    return res
  }
  const middle = await tellMiddle(
    runStart,
    guildId,
    state,
    beginning,
    provider
  )
  const ending = await tellEnding(
    runStart,
    guildId,
    beginning,
    middle,
    state,
    provider
  )
  const res: Story = {
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
    nextUpdateTime: findNextUpdateTime(
      runStart,
      [startTime, ...beginning.outcomeTimes, ...beginning.obstacleTimes, beginning.endTime],
      middle.allOutcomesSucceeded
    )
  }
  // make plainText
  res.richText.beginning.forEach(ls => res.plainText.push(ls.string))
  res.richText.middle.obstacleText.forEach((lsa, i) => {
    const outcomeText = res.richText.middle.outcomeText[i]
    if (outcomeText) {
      const strs = [
        ...lsa.map(ls => ls.string),
        ...outcomeText.main.map(ls => ls.string)
      ]
      outcomeText.triggerTexts.forEach(lsa => {
        lsa.forEach(ls => strs.push(ls.string))
      })
      outcomeText.resultTexts.forEach(lsa => {
        lsa.forEach(ls => strs.push(ls.string))
      })
      res.plainText.push(...strs)
    }
  })
  ending.text.main.forEach(ls => res.plainText.push(ls.string))
  ending.text.resultTexts.forEach(lsa => {
    lsa.forEach(ls => res.plainText.push(ls.string))
  })
  return res
}

async function tellBeginning(
  prng: Prando,
  state: State,
  startTime: number,
  length: number,
  guildId: number
  // provider: providers.BaseProvider
): Promise<Beginning> {
  // const prng = new Prando(seed)
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
  const guildText = makeGuildText(guild, party)

  /**
   * Generate quest
   */
  const quest = randomQuest(guildId, prng)
  let questText: LabeledString[] = []
  if (party.length >= 3) {
    questText = makeQuestText(quest)
  }

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
  for (let i = 1; i <= quest.difficulty; i++) {
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
    text: [...guildText, ...questText]
  }
}

async function tellMiddle(
  runStart: number,
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
    outcomeText: [],
    allOutcomesSucceeded: true
  }
  for (let i = 0; i < beginning.obstacleTimes.length; i++) {
    if (middle.allOutcomesSucceeded) {
      const obstacleTime = beginning.obstacleTimes[i]
      if (!obstacleTime) { throw new Error("No obstacle time") }

      let checkpoint = await newCheckpoint(runStart, obstacleTime, provider, `${guildId}`)

      if (!checkpoint.error) {
        if (i + 1 === beginning.obstacleTimes.length) {
          const obstacle = questObstacle(checkpoint.prng, beginning.quest)
          middle.obstacles.push(obstacle)
          middle.obstacleText.push(makeObstacleText(obstacle, beginning.party, middle.allResults))
        } else {
          const obstacle = randomObstacle(checkpoint.prng, i + 2)
          middle.obstacles.push(obstacle)
          middle.obstacleText.push(makeObstacleText(obstacle, beginning.party, middle.allResults))
        }
      }

      const outcomeTime = beginning.outcomeTimes[i]
      if (!outcomeTime) { throw new Error("No outcome time") }

      checkpoint = await newCheckpoint(runStart, outcomeTime, provider, `${guildId}`)
      const obstacle = middle.obstacles[i]

      if (!checkpoint.error && obstacle) {
        const outcome = await findOutcome(
          checkpoint.prng,
          beginning.guild.id,
          obstacle,
          beginning.party,
          middle.allResults,
          provider
        )
        if (outcome.success === Success.failure) middle.allOutcomesSucceeded = false
        if (i + 1 === beginning.obstacleTimes.length) middle.questSuccess = outcome.success
        middle.outcomes.push(outcome)
        middle.allResults = [...middle.allResults, ...outcome.results]
        middle.outcomeText = [...middle.outcomeText, makeOutcomeText(outcome, beginning.party, middle.allResults)]
      }
    }
  }

  return middle
}

async function tellEnding(
  runStart: number,
  guildId: number,
  beginning: Beginning,
  middle: Middle,
  state: State,
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
    text: {
      main: [],
      resultTexts: []
    }
  }

  const checkpoint = await newCheckpoint(runStart, beginning.endTime, provider, `${guildId}`)

  let deathCount = 0
  let everyoneDied = false
  let oneLeft = false

  if (!checkpoint.error) {
    for (let i = 0; i < middle.allResults.length; i++) {
      const result = middle.allResults[i]
      if (!result) { throw new Error("No result") }

      if (result.type === ResultType.Death) {
        deathCount += 1
        if (deathCount === beginning.party.length) everyoneDied = true
        if (deathCount === beginning.party.length - 1) oneLeft = true
      }

      if (result.type === ResultType.Injury) {
        const roll = checkpoint.prng.nextInt(1, 100)
        if (roll <= 5) {
          const guild = state.guilds[guildId]
          if (guild) {
            const adv = guild.adventurers[result.advId]
            if (adv) {
              const newResult: Result = {
                guildId: beginning.guild.id,
                advName: result.advName,
                advId: result.advId,
                type: ResultType.Trait,
                text: makeTraitText(adv, result.component),
                component: result.component
              }
              ending.results.push(newResult)
            }
          }
        }
      }
    }

    ending.text = makeEndingText(beginning, middle, everyoneDied, oneLeft, ending.results)
  }

  return ending
}
