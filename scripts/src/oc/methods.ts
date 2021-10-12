import Prando from 'prando'

import { Quest } from '../interfaces'
import { 
  questDifficulty,
  questVerbsAndObjectives,
  questFirstAdjective,
  questSecondAdjective,
  questFirstName,
  questLastName,
  questLocationName,
  questLocationType,
} from './sourceArrays'

// 1 = verb, objective, location / 2 = verb, adj, obj, loc, 3 = ver, adj, adj, obj, loc, 4 = ver, adj, adj, name, obj, loc
// TODO is it a problem that names can repeat like 'Macrosign Desert' 'Macrosign Forest'?
// TODO adjust the RNG so characters are more likely to "select" quests that fit them
export function randomQuest(prng: Prando): Quest {
  const res: any = { difficulty: prng.nextArrayItem(questDifficulty) }
  res.verb = prng.nextArrayItem(
    Object.keys(questVerbsAndObjectives)
  )
  const objectiveArray = questVerbsAndObjectives[res.verb]
  if (!objectiveArray) { throw new Error("No objective array") }
  res.objective = prng.nextArrayItem(objectiveArray)
  res.locationName = prng.nextArrayItem(questLocationName)
  res.locationType = prng.nextArrayItem(questLocationType)
  if (res.difficulty > 1) {
    res.firstAdjective = prng.nextArrayItem(questFirstAdjective)
  }
  if (res.difficulty > 2) {
    res.secondAdjective = prng.nextArrayItem(questSecondAdjective)
  }
  if (res.difficulty > 3) {
    res.firstName = prng.nextArrayItem(questFirstName)
    res.lastName = prng.nextArrayItem(questLastName)
  }
  return res as Quest
}