import Prando from 'prando'
import { providers } from 'ethers'

import { 
  Adventurer,
  Character,
  Pronouns,
  Result,
  Quest, 
  Obstacle, 
  ObstacleType, 
  Outcome, 
  QuestType,
  Success,
  Trigger,
  ResultType
} from './interfaces'
import { 
  obstacleInfo,
  questDifficulty,
  questGoalsAndInfo,
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
  activityAdjectives
} from './sourceArrays'
import { getRandomLootPiece, nameString } from '../loot'
import { makeProvider } from '../utils'

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
  res.questType = quest.type
  return res
}

/**
   * Qs:
   * - roll for each char separately, find overall result by combining? this one, I think
   *   or for overall result, then for each char?
   * - shoulds odds of success increase with larger party?
   * - how to choose the number of results? 
   *   for each adv, 
   *     on fail
   *     on mixed success
   *     on full success
   *     each has unique odds for type of result
   *     first roll number of results (depends on obstacle difficulty), then type / info for each
   * odds for number of results:
   * diff 1 = 0: 50, 1: 40, 2: 9, 3: 1
   * diff 2 = 0: 35, 1: 50, 2: 13, 3: 2
   * diff 3 = 0: 20, 1: 50, 2: 26, 3: 4
   * diff 4 = 0: 5, 1: 40, 2: 50, 3: 5
   * base odds for each result type:
   * fail = loot: 1, skill: 4, trait: 5, injury: 85, death: 5
   * mixed success = loot: 40, skill: 9, trait: 10, injury: 40, death: 1
   * full success = loot: 60, skill: 15, trait: 10, injury: 15, death: 0
   * 
   * if someone would get an injury, roll to see if it gets prevented by armor? yes!
   * for now, every piece of gear just gives +1 "armor"
   * 
   * result types = injury, death, loot, skill, trait
   * good results = loot, skill
   * neutral results = trait
   * bad results = injury, death
   * 
   * skills, traits, death are more rare
   * injuries and loot are more common
   * 
   * 
   * TODO: what do adventurers do if they acquire two head armors??
   *   whatever, for now they just "wear" it all
   * 
   */
  /**
   * individualResults = []
   * for each adv:
   *   create trait and skill triggers
   *   roll successRoll = random(1, 100) +/- skill and trait triggers
   *   successRoll <= 30: // succeeded = failed
   *   30 < successRoll <= 70: // succeeded = mixed success
   *   70 < successRoll: // full succeeded = success
   *   add to individualResults
   *   results = rollResults(succeeded)
   * 
   */

export async function findOutcome(
  prng: Prando, 
  obstacle: Obstacle, 
  party: Adventurer[],
  previousResults: Result[],
  provider: providers.BaseProvider | string,
): Promise<Outcome> {
  // TODO figure out previousResults
  if (typeof provider === "string") { provider = makeProvider(provider)}
  // TODO create trait and skill triggers
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
  let successSum: number = 0
  for(let i = 0; i < party.length; i++) {
    const adventurer = party[i]
    if (!adventurer) { throw new Error("No adventurer") }
    let successRoll = prng.nextInt(1, 100)
    // TODO 
    // - find trait, skill, loot triggers
    // - add those triggers to Outcome triggers
    // - add those triggers' modifiers to the successRoll
    let success = Success.failure
    if (30 < successRoll && successRoll <= 65 + 5 * obstacle.difficulty) {
      success = Success.mixed
    } else if (successRoll > 65 + 5 * obstacle.difficulty) {
      success = Success.success
    }
    successSum += success
    const results = await rollResults(
      prng,
      obstacle.difficulty,
      success,
      adventurer,
      [], // TODO
      provider
    )
    outcome.results = outcome.results.concat(results)
  }

  console.log('successSum', successSum)
  if (successSum <= 3) {
    const adjectives = activityAdjectives[Success.failure]
    if (!adjectives) { throw new Error("No adjectives") }
    outcome.adjective = prng.nextArrayItem(adjectives)

    if (obstacle.questType) {
      const questInfo = questGoalsAndInfo[obstacle.questType]
      if (!questInfo) { throw new Error("No quest info") }
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

    if (obstacle.questType) {
      const questInfo = questGoalsAndInfo[obstacle.questType]
      if (!questInfo) { throw new Error("No quest info") }
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

    if (obstacle.questType) {
      const questInfo = questGoalsAndInfo[obstacle.questType]
      if (!questInfo) { throw new Error("No quest info") }
      const resolver = prng.nextArrayItem(questInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    } else {
      const resolver = prng.nextArrayItem(obsInfo.resolvers)[0]
      if (!resolver) { throw new Error("No resolver") }
      outcome.resolver = resolver
    }
  }
  return outcome
}

async function rollResults(
  prng: Prando,
  difficulty: number,
  success: Success, 
  adventurer: Adventurer, 
  triggers: Trigger[],
  provider: providers.BaseProvider
): Promise<Result[]> {
  // TODO incorporate triggers here when relevant?
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
      characterName: adventurer.name,
      type: ResultType.Injury,
      text: "",
      component: ""
    }
    const typeRoll = prng.nextInt(1, 100)
    if (typeRoll <= typeOdds["INJURY"]) {
      const injury = prng.nextArrayItem(Injuries)
      result.text = insertPronouns(
        `${nameString(adventurer.name)} ${injury.text}`,
        adventurer.pronouns
      )
      result.component = prng.nextArrayItem(injury.traits)
    } else if (typeRoll > typeOdds["INJURY"] && typeRoll <= typeOdds["DEATH"]) {
      result.type = ResultType.Death
      result.text = insertPronouns(
        `${nameString(adventurer.name)} died`,
        adventurer.pronouns
      )
    } else if (typeRoll > typeOdds["DEATH"] && typeRoll <= typeOdds["LOOT"]) {
      result.type = ResultType.Loot
      const lootPiece = await getRandomLootPiece(prng, provider)
      result.component = lootPiece
      result.text = insertPronouns(
        `${nameString(adventurer.name)} found ${lootPiece}!`,
        adventurer.pronouns
      )
    } else if (typeRoll > typeOdds["LOOT"] && typeRoll <= typeOdds["SKILL"]) {
      result.type = ResultType.Skill
      const skill = prng.nextArrayItem(skills)
      result.component = skill
      result.text = insertPronouns(
        `${nameString(adventurer.name)} learned ${skill}!`,
        adventurer.pronouns
      )
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
// TODO adjust the RNG so characters are more likely to "select" quests that fit them
export function randomQuest(prng: Prando): Quest {
  const type = prng.nextArrayItem(
    Object.keys(questGoalsAndInfo)
  ) as QuestType
  const questInfo = questGoalsAndInfo[type]
  if (!questInfo) { throw new Error("No quest info") }
  const res: Quest = { 
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