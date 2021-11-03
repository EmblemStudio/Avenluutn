import { providers } from 'ethers'
import Prando from 'prando'

import { Obstacle, Quest, Outcome, ObstacleType } from '../content/interfaces'

export function makeQuestText(quest: Quest): string {
  let text = `Consulting the guild, they choose their quest: to ${quest.type} the`
  if (quest.firstAdjective) {
    text += ` ${quest.firstAdjective}`
  }
  if (quest.secondAdjective) {
    text += `, ${quest.secondAdjective}`
  }
  text += ` ${quest.objective}`
  if (quest.firstName) {
    text += ` "${quest.firstName} ${quest.lastName}"`
  }
  text += ` at the ${quest.locationName} ${quest.locationType}.`
  return text
}

export function makeObstacleText(obstacle: Obstacle): string {
  let text = ``
  if (obstacle.quest) {
    text += `They arrived at the ${obstacle.quest.locationName} ${obstacle.quest.locationType}, where they`
  } else {
    text += `They`
  }
  text += ` ${obstacle.discovery}`
  if (obstacle.firstName) {
    text += ` the`
  } else {
    const firstChar = obstacle.object[0]
    if (!firstChar) { throw new Error("No first character") }
    const lastChar = obstacle.object[obstacle.object.length - 1]
    if (!lastChar) { throw new Error("No last character") }
    if (lastChar === "s") {
      text += ` some` 
    } else if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
      text += ` an`
    } else {
      text += ` a`
    }
  }
  if (obstacle.firstAdjective) text += ` ${obstacle.firstAdjective}`
  if (obstacle.secondAdjective) text += ` ${obstacle.secondAdjective}`
  text += ` ${obstacle.object}`
  if (obstacle.firstName) text += ` ${obstacle.firstName} ${obstacle.lastName}`
  if (obstacle.additions) {
    obstacle.additions.forEach(addition => {
      text += `, ${addition}`
    })
  }
  text += `.`
  return text
}

export interface OutcomeText {
  main: string;
  results: string[];
}

export function makeOutcomeText(outcome: Outcome): OutcomeText {
  let res: OutcomeText = { main: "", results: [] }
  res.main = `After ${outcome.adjective} ${outcome.activity}, they ${outcome.resolver} the ${outcome.obstacle.object}.`
  outcome.results.forEach(result => {
    res.results.push(result.text)
  })
  return res
}