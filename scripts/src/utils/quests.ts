import Prando from 'prando'
import { providers } from 'ethers'

import {
  Adventurer,
  Result,
  Quest,
  Obstacle,
  Outcome,
  Success,
  ResultType,
  Results
} from './interfaces'
import {
  // obstacleInfo,
  obstacleActivities,
  obstacleDiscoveries,
  obstacleObjects,
  obstaclePositiveResolvers,
  obstacleNegativeResolvers,
  QuestType,
  questDifficulty,
  // questTypesAndInfo,
  questActivities,
  questObjectives,
  questPositiveResolvers,
  questNegativeResolvers,
  genericFirstAdjectives,
  genericSecondAdjectives,
  genericFirstName,
  genericLastName,
  questLocationName,
  questLocationType,
  questObstacleMap,
  numberOfResultsOdds,
  typeOfResultOdds,
  injuries,
  skills,
  traits,
  activityAdjectives,
  triggerMap,
  ObstacleType,
  obstacleArrivals,
  SuccessType
} from '../content/original/originalContent'
import {
  makeInjuryText,
  makeDeathText,
  makeLootText,
  makeTraitText,
  makeSkillText,
  makeKnockoutText,
  makeTriggerText
} from './makeText'
import { processResults } from './processResults'
import { getRandomLootPiece } from '../content/loot'
import { makeObstacleText } from './makeText'
import { makeProvider } from './newCheckpoint'

// 1 = verb, objective, location / 2 = verb, adj, obj, loc, 3 = ver, adj, adj, obj, loc, 4 = ver, adj, adj, name, obj, loc
// TODO adjust the RNG so characters are more likely to "select" quests that fit them?
export function randomQuest(guildId: number, prng: Prando): Quest {
  const type = prng.nextArrayItem(QuestType)
  const activities = questActivities[type]
  if (!activities) { throw new Error("No quest activities") }
  const objectives = questObjectives[type]
  if (!objectives) { throw new Error("No quest objectives") }
  const positiveResolvers = questPositiveResolvers[type]
  if (!positiveResolvers) { throw new Error("No quest positiveResolvers") }
  const negativeResolvers = questNegativeResolvers[type]
  if (!negativeResolvers) { throw new Error("No quest negativeResolvers") }
  // const questInfo = questTypesAndInfo[type]
  // if (!questInfo) { throw new Error("No quest info") }
  const res: Quest = {
    guildId,
    difficulty: prng.nextArrayItem(questDifficulty),
    type,
    objective: prng.nextArrayItem(objectives).objective,
    locationName: prng.nextArrayItem(questLocationName),
    locationType: prng.nextArrayItem(questLocationType)
  }
  if (res.difficulty > 1) {
    res.firstAdjective = prng.nextArrayItem(genericFirstAdjectives)
  }
  if (res.difficulty > 2) {
    res.secondAdjective = prng.nextArrayItem(genericSecondAdjectives)
  }
  if (res.difficulty > 3) {
    res.firstName = prng.nextArrayItem(genericFirstName)
    res.lastName = prng.nextArrayItem(genericLastName)
  }
  return res
}

export function randomObstacle(prng: Prando, difficulty: number): Obstacle {
  // TODO use an enum for difficulty in randomObstacle
  if (![2, 3, 4, 5].includes(difficulty)) { throw new Error("Difficulty must be 2, 3, 4, or 5") }
  const type = prng.nextArrayItem(ObstacleType)
  const discoveries = obstacleDiscoveries[type]
  if (!discoveries) { throw new Error("No obstacle discoveries") }
  const objects = obstacleObjects[type]
  if (!objects) { throw new Error("No obstacle objects") }
  const res: Obstacle = {
    difficulty,
    type,
    arrival: prng.nextArrayItem(obstacleArrivals),
    discovery: prng.nextArrayItem(discoveries).discovery,
    object: prng.nextArrayItem(objects).object,
    // additions: [] TODO additions
  }
  if (res.difficulty > 1) {
    res.firstAdjective = prng.nextArrayItem(genericFirstAdjectives)
  }
  if (res.difficulty > 2) {
    res.secondAdjective = prng.nextArrayItem(genericSecondAdjectives)
  }
  if (res.difficulty > 3) {
    res.firstName = prng.nextArrayItem(genericFirstName)
    res.lastName = prng.nextArrayItem(genericLastName)
  }
  return res
}

export function questObstacle(prng: Prando, quest: Quest): Obstacle {
  const goal = quest.type.toUpperCase()
  const typeArray = questObstacleMap[goal]
  if (!typeArray) { throw new Error("No typeArray") }
  const typeObj = typeArray[0]
  if (!typeObj) { throw new Error("No type obj") }
  const type = typeObj.obstacleType
  if (type === goal) {
    return randomObstacle(prng, quest.difficulty)
  }
  const discoveries = obstacleDiscoveries[type]
  if (!discoveries) { throw new Error("No obstacle discoveries") }
  const res: Obstacle = {
    difficulty: quest.difficulty,
    type,
    arrival: prng.nextArrayItem(obstacleArrivals),
    discovery: prng.nextArrayItem(discoveries).discovery,
    object: quest.objective
    // additions: [] TODO additions
  }
  if (quest.firstAdjective) res.firstAdjective = quest.firstAdjective
  if (quest.secondAdjective) res.secondAdjective = quest.secondAdjective
  if (quest.firstName) res.firstName = quest.firstName
  if (quest.lastName) res.lastName = quest.lastName
  res.quest = quest
  return res
}

export async function findOutcome(
  prng: Prando,
  guildId: number,
  obstacle: Obstacle,
  party: Adventurer[],
  previousResults: Result[],
  provider: providers.BaseProvider | string,
): Promise<Outcome> {
  if (typeof provider === "string") { provider = makeProvider(provider) }
  const activities = obstacleActivities[obstacle.type]
  if (!activities) { throw new Error("No obstacle activities") }
  const outcome: Outcome = {
    success: Success.failure,
    adjective: "",
    resolver: "",
    activity: prng.nextArrayItem(activities).activity,
    obstacle,
    triggers: [],
    results: []
  }

  // reorganize results
  const processedResults = processResults(previousResults)

  let everyoneKnockedOut = false
  let knockOutCount = 0
  let successSum: number = 0

  for (let i = 0; i < party.length; i++) {
    const adventurer = party[i]
    if (!adventurer) { throw new Error("No adventurer") }
    const advResults = processedResults[adventurer.id]
    let knockoutOrDeath = false
    if (advResults) {
      // If an adventurer is knocked out or dead, skip them
      if (advResults[ResultType.Knockout].length > 0) {
        knockOutCount += 1
        if (knockOutCount === party.length) {
          everyoneKnockedOut = true
        }
        knockoutOrDeath = true
      }
      if (advResults[ResultType.Death].length > 0) {
        knockoutOrDeath = true
      }
    }
    if (knockoutOrDeath === false) {
      let successRoll = prng.nextInt(1, 100)

      // Skill, loot, & trait triggers!
      Object.keys(triggerMap).forEach(keyword => {
        let index = -1
        makeObstacleText(obstacle, party, previousResults).forEach(ls => {
          const localIndex = ls.string.indexOf(keyword)
          if (localIndex >= 0) index = localIndex
        })
        if (index >= 0) {
          // console.log('found trigger keyword', makeObstacleText(obstacle), keyword, index)
          const triggerInfos = triggerMap[keyword]
          if (!triggerInfos) { throw new Error("No trigger infos") }
          triggerInfos.forEach(triggerInfo => {
            const qualities = adventurer[triggerInfo.type]
            if (!qualities) { throw new Error("No adventurer qualities") }
            // doing it like this because keywords are subsets of loot strings
            const hasName = qualities.join(" ").indexOf(triggerInfo.name)
            // console.log('hasName', hasName, qualities.join(" "), triggerInfo)
            if (hasName >= 0) {
              const triggerRoll = prng.nextInt(1, 100)
              if (triggerRoll <= triggerInfo.chance) {
                // TODO add trigger text to makeText and get it into final results
                successRoll += triggerInfo.modifier
                const text = makeTriggerText(triggerInfo, adventurer, traits, qualities)
                outcome.triggers.push({
                  characterName: adventurer.name,
                  triggeredComponent: triggerInfo.name,
                  text
                })
              }
            }
          })
        }
      })

      let success = Success.failure
      if (10 < successRoll && successRoll <= 45 + 5 * obstacle.difficulty) {
        success = Success.mixed
      } else if (successRoll > 45 + 5 * obstacle.difficulty) {
        success = Success.success
      }
      successSum += success
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
        type: ResultType.Death,
        text: makeDeathText(adv),
        component: ""
      })
    })
    // set successSum to 0
    successSum = 0
  }

  if (successSum <= 3) {
    const adjectives = activityAdjectives["FAILURE"]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives).text

    if (obstacle.quest) {
      const activities = questActivities[obstacle.quest.type]
      if (!activities) { throw new Error("No quest activities") }
      outcome.activity = prng.nextArrayItem(activities).activity
      const resolvers = questNegativeResolvers[obstacle.quest.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).negativeResolver
    } else {
      const resolvers = obstacleNegativeResolvers[obstacle.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).negativeResolver
    }

  } else if (successSum > 3 && successSum <= 7) {
    outcome.success = Success.mixed

    const adjectives = activityAdjectives["MIXED"]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives).text

    if (obstacle.quest) {
      /*
      const questInfo = questTypesAndInfo[obstacle.quest.type]
      if (!questInfo) { throw new Error("No quest info") }
      outcome.activity = prng.nextArrayItem(questInfo.activities)
      const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
      */
      const activities = questActivities[obstacle.quest.type]
      if (!activities) { throw new Error("No quest activities") }
      outcome.activity = prng.nextArrayItem(activities).activity
      const resolvers = questPositiveResolvers[obstacle.quest.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver
    } else {
      /*
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
      */
      const resolvers = obstaclePositiveResolvers[obstacle.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver
    }

  } else if (successSum > 7) {
    outcome.success = Success.success

    const adjectives = activityAdjectives["SUCCESS"]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives).text

    if (obstacle.quest) {
      /*
      const questInfo = questTypesAndInfo[obstacle.quest.type]
      if (!questInfo) { throw new Error("No quest info") }
      outcome.activity = prng.nextArrayItem(questInfo.activities)
      const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
      */
      const activities = questActivities[obstacle.quest.type]
      if (!activities) { throw new Error("No quest activities") }
      outcome.activity = prng.nextArrayItem(activities).activity
      const resolvers = questPositiveResolvers[obstacle.quest.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver
    } else {
      /*
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
      */
      const resolvers = obstaclePositiveResolvers[obstacle.type]
      if (!resolvers) { throw new Error("No quest resolvers") }
      outcome.resolver = prng.nextArrayItem(resolvers).positiveResolver
    }
  }

  // TODO awkward to have to loop through adventurers again here
  for (let i = 0; i < party.length; i++) {
    const adventurer = party[i]
    if (!adventurer) { throw new Error("No adventurer") }
    const advResults = processedResults[adventurer.id]
    let knockoutOrDeath = false
    if (advResults) {
      // If an adventurer is knocked out or dead, skip them
      if (
        advResults[ResultType.Knockout].length > 0 ||
        advResults[ResultType.Death].length > 0
      ) {
        knockoutOrDeath = true
      }
    }
    if (knockoutOrDeath === false) {
      const results = await rollResults(
        prng,
        guildId,
        obstacle.difficulty,
        outcome.success,
        adventurer,
        provider,
        advResults
      )
      outcome.results = outcome.results.concat(results)
    }
  }

  return outcome
}

async function rollResults(
  prng: Prando,
  guildId: number,
  difficulty: number,
  success: Success,
  adventurer: Adventurer,
  provider: providers.BaseProvider,
  previousResults?: Results,
): Promise<Result[]> {
  const results: Result[] = []
  let length = 0
  const oddsArray = numberOfResultsOdds[difficulty]
  if (oddsArray === undefined) throw new Error("No oddsArray")
  const lengthOdds = oddsArray[0]
  if (lengthOdds === undefined) throw new Error("No odds")
  const zeroOdds = lengthOdds[0]
  const oneOdds = lengthOdds[1]
  const twoOdds = lengthOdds[2]
  if (!zeroOdds || !oneOdds || !twoOdds) { throw new Error("Incomplete odds") }
  const lengthRoll = prng.nextInt(1, 100)
  if (lengthRoll <= zeroOdds) {
    length = 0
  } else if (lengthRoll > zeroOdds && lengthRoll <= oneOdds) {
    length = 1
  } else if (lengthRoll > oneOdds && lengthRoll <= twoOdds) {
    length = 2
  } else if (lengthRoll > twoOdds) {
    length = 3
  }
  const successStr = SuccessType[success]
  if (successStr === undefined) throw new Error("No success string")
  const typeOddsArray = typeOfResultOdds[successStr]
  if (typeOddsArray === undefined) throw new Error("No type odds array")
  const typeOdds = typeOddsArray[0]
  if (typeOdds === undefined) throw new Error("No type odds")
  for (let i = 0; i < length; i++) {
    const result: Result = {
      guildId,
      advName: adventurer.name,
      advId: adventurer.id,
      type: ResultType.Injury,
      text: [],
      component: ""
    }
    const typeRoll = prng.nextInt(1, 100)

    // TODO prevent repeat injuries?
    const injuryOdds = typeOdds["INJURY"]
    if (injuryOdds === undefined) throw new Error("No injuryOdds")
    const deathOdds = typeOdds["DEATH"]
    if (deathOdds === undefined) throw new Error("No deathOdds")
    const lootOdds = typeOdds["LOOT"]
    if (lootOdds === undefined) throw new Error("No lootOdds")
    const skillOdds = typeOdds["SKILL"]
    if (skillOdds === undefined) throw new Error("No skillOdds")

    if (typeRoll <= injuryOdds) {
      const injuryText = prng.nextArrayItem(Object.keys(injuries))
      result.text = makeInjuryText(adventurer, injuryText)
      const injury = injuries[injuryText]
      if (injury === undefined) throw new Error("No injury")
      result.component = prng.nextArrayItem(injury).trait
      // if third injury, skip rest of results
      if (previousResults) {
        if (previousResults[ResultType.Injury].length === 2) i = length
      }
    } else if (typeRoll > injuryOdds && typeRoll <= deathOdds) {
      result.type = ResultType.Death
      result.text = makeDeathText(adventurer)
      // if they died, skip rest of results
      i = length
    } else if (typeRoll > deathOdds && typeRoll <= lootOdds) {
      result.type = ResultType.Loot
      const lootPiece = await getRandomLootPiece(prng, provider)
      result.component = lootPiece
      result.text = makeLootText(adventurer, lootPiece)
      // TODO adventurers should not be able to get repeat skills
    } else if (typeRoll > lootOdds && typeRoll <= skillOdds) {
      result.type = ResultType.Skill
      const skill = prng.nextArrayItem(skills)
      result.component = skill
      result.text = makeSkillText(adventurer, skill)
      // TODO adventurers should not be able to get repeat traits
    } else if (typeRoll > skillOdds) {
      result.type = ResultType.Trait
      const trait = prng.nextArrayItem(Object.keys(traits))
      result.component = trait
      result.text = makeTraitText(adventurer, trait)
    }
    results.push(result)
    // If this is the third injury, add a knockout result
    if (previousResults) {
      if (result.type === ResultType.Injury && previousResults[ResultType.Injury].length === 2) {
        results.push({
          guildId,
          advName: adventurer.name,
          advId: adventurer.id,
          type: ResultType.Knockout,
          text: makeKnockoutText(adventurer),
          component: ""
        })
      }
    }
  }
  return results
}