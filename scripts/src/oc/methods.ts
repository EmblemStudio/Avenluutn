import Prando from 'prando'
import { providers } from 'ethers'

import { 
  Adventurer,
  Pronouns,
  Result,
  Quest, 
  Obstacle, 
  ObstacleType, 
  Outcome, 
  QuestType,
  Success,
  ResultType,
  Results
} from './interfaces'
import { 
  obstacleInfo,
  questDifficulty,
  questTypesAndInfo,
  genericFirstAdjectives,
  genericSecondAdjectives,
  genericFirstName,
  genericLastName,
  questLocationName,
  questLocationType,
  questObstacleMap,
  numberOfResultsOdds,
  typeOfResultOdds,
  Injuries,
  skills,
  traits,
  activityAdjectives,
  triggerMap
} from './sourceArrays'
import { getRandomLootPiece, nameString } from '../loot'
import { makeProvider, makeObstacleText } from '../utils'

export function randomObstacle(prng: Prando, difficulty: number): Obstacle {
  if (![1,2,3,4].includes(difficulty)) { throw new Error ("Difficulty must be 1, 2, 3, or 4")}
  const type: ObstacleType = prng.nextArrayItem(Object.values(ObstacleType))
  const res: Obstacle = {
    difficulty,
    type,
    discovery: prng.nextArrayItem(obstacleInfo[type].discovery),
    object: prng.nextArrayItem(obstacleInfo[type].objects),
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
  const type = questObstacleMap[goal]
  if (!type) { throw new Error("No type") }
  if (type === goal) {
    return randomObstacle(prng, quest.difficulty)
  }
  const obsInfo = obstacleInfo[type]
  if (!obsInfo) { throw new Error("No obstacle info") }
  const res: Obstacle = {
    difficulty: quest.difficulty,
    type,
    discovery: prng.nextArrayItem(obsInfo.discovery),
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
  if (typeof provider === "string") { provider = makeProvider(provider)}
  const obsInfo = obstacleInfo[obstacle.type]
  if (!obsInfo) { throw new Error("No obstacle info") }
  const outcome: Outcome = {
    success: Success.failure,
    adjective: "",
    resolver: "",
    activity: prng.nextArrayItem(obsInfo.activities),
    obstacle,
    triggers: [],
    results: []
  }

  // reorganize results
  const processedResults: { [advId: number]: Results } = {}
  previousResults.forEach(result => { 
    let advResults = processedResults[result.advId]
    if (!advResults) {
      advResults = {
        "INJURY": [],
        "KNOCKOUT": [],
        "DEATH": [],
        "LOOT": [],
        "SKILL": [],
        "TRAIT": [],
      }
    }
    advResults[result.type].push(result)
    processedResults[result.advId] = advResults
  })
  

  let everyoneKnockedOut = false
  let knockOutCount = 0
  let successSum: number = 0

  for(let i = 0; i < party.length; i++) {
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
        const index = makeObstacleText(obstacle).indexOf(keyword)
        if (index >= 0) {
          const triggerInfos = triggerMap[keyword]
          if (!triggerInfos) { throw new Error ("No trigger infos") }
          triggerInfos.forEach(triggerInfo => {
            const qualities = adventurer[triggerInfo.type]
            if (!qualities) { throw new Error("No adventurer qualities") }
            const hasName = qualities.join(" ").indexOf(triggerInfo.name)
            if (hasName >= 0) {
              const triggerRoll = prng.nextInt(1, 100)
              if (triggerRoll <= triggerInfo.chance) {
                successRoll += triggerInfo.modifier
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
        text: insertPronouns(
          `${nameString(adv.name)} died.`,
          adv.pronouns
        ),
        component: ""
      })
    })
    // set successSum to 0
    successSum = 0
  }

  if (successSum <= 3) {
    const adjectives = activityAdjectives[Success.failure]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives)

    if (obstacle.quest) {
      const questInfo = questTypesAndInfo[obstacle.quest.type]
      if (!questInfo) { throw new Error("No quest info") }
      outcome.activity = prng.nextArrayItem(questInfo.activities)
      const resolver = prng.nextArrayItem(questInfo.resolvers)[1]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    } else {
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[1]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    }

  } else if (successSum > 3 && successSum <= 7) {
    outcome.success = Success.mixed
    
    const adjectives = activityAdjectives[Success.mixed]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives)

    if (obstacle.quest) {
      const questInfo = questTypesAndInfo[obstacle.quest.type]
      if (!questInfo) { throw new Error("No quest info") }
      outcome.activity = prng.nextArrayItem(questInfo.activities)
      const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    } else {
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    }

  } else if (successSum > 7) {
    outcome.success = Success.success
    
    const adjectives = activityAdjectives[Success.success]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives)

    if (obstacle.quest) {
      const questInfo = questTypesAndInfo[obstacle.quest.type]
      if (!questInfo) { throw new Error("No quest info") }
      outcome.activity = prng.nextArrayItem(questInfo.activities)
      const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    } else {
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    }
  }

  // TODO awkward to have to loop through adventurers again here
  for(let i = 0; i < party.length; i++) {
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
  const lengthOdds = numberOfResultsOdds[difficulty]
  if (!lengthOdds) { throw new Error("No odds") }
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
  const typeOdds = typeOfResultOdds[success]
  for(let i = 0; i < length; i++) {
    const result: Result = {
      guildId,
      advName: adventurer.name,
      advId: adventurer.id,
      type: ResultType.Injury,
      text: "",
      component: ""
    }
    const typeRoll = prng.nextInt(1, 100)
    if (typeRoll <= typeOdds["INJURY"]) {
      const injury = prng.nextArrayItem(Injuries)
      result.text = insertPronouns(
        `${nameString(adventurer.name)} ${injury.text}.`,
        adventurer.pronouns
      )
      result.component = prng.nextArrayItem(injury.traits)
      // if third injury, skip rest of results
      if (previousResults) {
        if (previousResults[ResultType.Injury].length === 2) i = length
      }
    } else if (typeRoll > typeOdds["INJURY"] && typeRoll <= typeOdds["DEATH"]) {
      result.type = ResultType.Death
      result.text = insertPronouns(
        `${nameString(adventurer.name)} died.`,
        adventurer.pronouns
      )
      // if they died, skip rest of results
      i = length
    } else if (typeRoll > typeOdds["DEATH"] && typeRoll <= typeOdds["LOOT"]) {
      result.type = ResultType.Loot
      const lootPiece = await getRandomLootPiece(prng, provider)
      result.component = lootPiece
      result.text = insertPronouns(
        `${nameString(adventurer.name)} found ${lootPiece}!`,
        adventurer.pronouns
      )
    // TODO adventurers should not be able to get repeat skills
    } else if (typeRoll > typeOdds["LOOT"] && typeRoll <= typeOdds["SKILL"]) {
      result.type = ResultType.Skill
      const skill = prng.nextArrayItem(skills)
      result.component = skill
      result.text = insertPronouns(
        `${nameString(adventurer.name)} learned ${skill}!`,
        adventurer.pronouns
      )
    // TODO adventurers should not be able to get repeat traits
    } else if (typeRoll > typeOdds["SKILL"]) {
      result.type = ResultType.Trait
      const trait = prng.nextArrayItem(Object.keys(traits))
      result.component = trait
      result.text = insertPronouns(
        `${nameString(adventurer.name)} now has ${trait}!`,
        adventurer.pronouns
      )
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
          text: `${nameString(adventurer.name)} was knocked out.`,
          component: ""
        })
      }
    }
  }
  return results
}

function insertPronouns(string: string, pronouns: Pronouns): string {
  const pronounTypes = Object.keys(pronouns)
  const splitString = string.split("*")
  if (splitString.length < 1) return string
  splitString.forEach((s, i) => {
    pronounTypes.forEach(pt => {
      if (s === pt) {
        const pronoun = pronouns[pt]
        if (!pronoun) throw new Error("No pronoun")
        splitString[i] = pronoun
      }
    })
  })
  return splitString.join('')
}

// 1 = verb, objective, location / 2 = verb, adj, obj, loc, 3 = ver, adj, adj, obj, loc, 4 = ver, adj, adj, name, obj, loc
// TODO is it a problem that names can repeat like 'Macrosign Desert' 'Macrosign Forest'?
// TODO adjust the RNG so characters are more likely to "select" quests that fit them?
export function randomQuest(guildId: number, prng: Prando): Quest {
  const type = prng.nextArrayItem(
    Object.keys(questTypesAndInfo)
  ) as QuestType
  const questInfo = questTypesAndInfo[type]
  if (!questInfo) { throw new Error("No quest info") }
  const res: Quest = { 
    guildId,
    difficulty: prng.nextArrayItem(questDifficulty),
    type,
    objective: prng.nextArrayItem(questInfo.objectives),
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