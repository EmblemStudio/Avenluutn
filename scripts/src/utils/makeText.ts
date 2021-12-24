import { 
  Obstacle, 
  Quest, 
  Outcome, 
  Adventurer, 
  Guild, 
  Success, 
  OutcomeText, 
  Beginning, 
  Middle, 
  Pronouns, 
  LabeledString,
  Label,
  TriggerInfo,
  Traits,
  Result,
  ResultType,
  EndingText
} from './interfaces'
import { nameString } from '../content/loot'

export function makeGuildText(guild: Guild, party: Adventurer[]): LabeledString[] {
  if (party.length < 3 ) {
    return [{ string: `With too few adventurers to embark, the guild stagnates. `, label: Label.conjunctive }]
  }
  const res: LabeledString[] = [
    { string: ``, label: Label.conjunctive },
    { string: `At `, label: Label.conjunctive },
    { string: guild.name, label: Label.guildName },
    { string: ` in `, label: Label.conjunctive },
    { string: guild.location, label: Label.locationName },
    { string: `, `, label: Label.conjunctive }
  ]
  party.forEach((a, i) => {
    if (i === party.length - 1) {
      res.push({ string: `and `, label: Label.conjunctive })
      res.push({string: `${nameString(a.name)} `, label: Label.adventurerName })
    } else {
      res.push({string: `${nameString(a.name)}, `, label: Label.adventurerName })
    }
  })
  res.push({ string: `gathered. `, label: Label.conjunctive })
  return res
}

export function makeQuestText(quest: Quest): LabeledString[] {
  const res: LabeledString[] = [
    { string: `Consulting the guild, they chose their quest: to `, label: Label.conjunctive },
    { string: quest.type, label: Label.questType},
    { string: ` the `, label: Label.conjunctive }
  ]
  // let text = `Consulting the guild, they chose their quest: to ${quest.type} the`
  if (quest.firstAdjective) res.push({ string: quest.firstAdjective, label: Label.adjective})
  if (quest.secondAdjective) {
    res.push(
      { string: `, `, label: Label.conjunctive},
      { string: quest.secondAdjective, label: Label.adjective }
    )
    // text += `, ${quest.secondAdjective}`
  }
  res.push({ string: ` ${quest.objective}`, label: Label.questObjective})
  // text += ` ${quest.objective}`
  if (quest.firstName) {
    res.push({ string: ` "${quest.firstName} ${quest.lastName}"`, label: Label.obstacleName})
    // text += ` "${quest.firstName} ${quest.lastName}"`
  }
  res.push(
    { string: ` at the `, label: Label.conjunctive },
    { string: `${quest.locationName} `, label: Label.locationName },
    { string: quest.locationType, label: Label.locationType },
    { string: `.`, label: Label.conjunctive }
  )
  // text += ` at the ${quest.locationName} ${quest.locationType}.`
  return res
}

function lastAdventurer(party: Adventurer[], results: Result[]): Adventurer | undefined {
  let lastAdv: Adventurer | undefined
  const stillUp = [...party]
  results.forEach(r => {
    if (r.type === ResultType.Death || r.type === ResultType.Knockout) {
      stillUp.forEach((adv, i) => {
        if (adv.id === r.advId) delete stillUp[i]
      })
      if (Object.keys(stillUp).length === 1) {
        lastAdv = stillUp[0]
      }
    }
  })
  return lastAdv
}

export function makeObstacleText(obstacle: Obstacle, party: Adventurer[], results: Result[]): LabeledString[] {
  const lastAdv = lastAdventurer(party, results)
  const res: LabeledString[] = []
  if (obstacle.quest) {
    if (lastAdv !== undefined) {
      res.push({ string: `${lastAdv.name.firstName} `, label: Label.conjunctive })
    } else {
      res.push({ string: `They `, label: Label.conjunctive })
    }
    res.push(
      { string: `arrived at the `, label: Label.conjunctive },
      { string: obstacle.quest.locationName, label: Label.locationName },
      { string: ` ${obstacle.quest.locationType}`, label: Label.locationType },
      { string: `, where `, label: Label.conjunctive }
    )
    if (lastAdv !== undefined) {
      res.push({ string: `${lastAdv.pronouns.subject} `, label: Label.conjunctive })
    } else {
      res.push({ string: `they `, label: Label.conjunctive })
    }
    // text += `They arrived at the ${obstacle.quest.locationName} ${obstacle.quest.locationType}, where they`
  } else {
    res.push({ string: `${obstacle.arrival}, `, label: Label.conjunctive })
    if (lastAdv !== undefined) {
      res.push({ string: `${lastAdv.name.firstName} `, label: Label.conjunctive })
    } else {
      res.push({ string: `they `, label: Label.conjunctive })
    }
  }
  res.push({ string: `${obstacle.discovery} `, label: Label.obstacleDiscovery })
  // text += ` ${obstacle.discovery}`
  if (obstacle.firstName) {
    res.push({ string: `the `, label: Label.conjunctive })
    // text += ` the`
  } else {
    let firstWord = obstacle.object[0]
    if (obstacle.firstAdjective) firstWord = obstacle.firstAdjective
    if (!firstWord) { throw new Error("No first word") }
    const firstChar = firstWord[0]
    if (!firstChar) { throw new Error("No first character") }
    const lastChar = obstacle.object[obstacle.object.length - 1]
    if (!lastChar) { throw new Error("No last character") }
    if (lastChar === "s") {
      res.push({ string: `some `, label: Label.conjunctive })
      // text += ` some` 
    } else if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
      res.push({ string: `an `, label: Label.conjunctive })
      // text += ` an`
    } else {
      res.push({ string: `a `, label: Label.conjunctive })
      // text += ` a`
    }
  }
  if (obstacle.firstAdjective) res.push({ string: `${obstacle.firstAdjective}`, label: Label.adjective })
    // text += ` ${obstacle.firstAdjective}`
  if (obstacle.secondAdjective) res.push({ string: `, ${obstacle.secondAdjective}`, label: Label.adjective })
    // text += ` ${obstacle.secondAdjective}`
  res.push({ string: ` ${obstacle.object}`, label: Label.object })
  // text += ` ${obstacle.object}`
  if (obstacle.firstName) res.push({ string: ` "${obstacle.firstName} ${obstacle.lastName}"`, label: Label.obstacleName })
    // text += ` ${obstacle.firstName} ${obstacle.lastName}`
  if (obstacle.additions) {
    obstacle.additions.forEach(addition => {
      res.push({ string: `, ${addition}`, label: Label.conjunctive })
      // text += `, ${addition}`
    })
  }
  res.push({ string: `.`, label: Label.conjunctive })
  // text += `.`
  // return text
  return res
}

// TODO account for one adventurer being left in outcome text
export function makeOutcomeText(outcome: Outcome, party: Adventurer[], results: Result[]): OutcomeText {
  const lastAdv = lastAdventurer(party, results)
  let res: OutcomeText = { main: [], triggerTexts: [], resultTexts: [] }
  res.main.push(
    { string: `After `, label: Label.conjunctive },
    { string:  `${outcome.adjective} `, label: Label.adjective },
    { string:  `${outcome.activity}`, label: Label.outcomeActivity }
  )
  if (lastAdv !== undefined) {
    res.main.push({ string: `, ${lastAdv.name.firstName} `, label: Label.conjunctive })
  } else {
    res.main.push({ string: `, they `, label: Label.conjunctive })
  }
  res.main.push(
    { string:  `${outcome.resolver}`, label: Label.outcomeResolver },
    { string:  ` the `, label: Label.conjunctive },
    { string:  `${outcome.obstacle.object}`, label: Label.object },
    { string: `.`, label: Label.conjunctive }
  )
  // res.main = `After ${outcome.adjective} ${outcome.activity}, they ${outcome.resolver} the ${outcome.obstacle.object}.`
  outcome.triggers.forEach(trigger => {
    res.triggerTexts.push(trigger.text)
  })
  outcome.results.forEach(result => {
    res.resultTexts.push(result.text)
  })
  return res
}

export function makeEndingText(
  beginning: Beginning, 
  middle: Middle, 
  everyoneDied: boolean, 
  oneLeft: boolean,
  endingResults: Result[]
): EndingText {
  const res: EndingText = {
    main: [],
    resultTexts: []
  }
  if (everyoneDied) {
    res.main.push({ string: `None who set out returned alive.`, label: Label.conjunctive })
    // res[0] = `None who set out returned alive.`
  } else {
    if (oneLeft) {
      res.main.push({ string: `The last adventurer `, label: Label.conjunctive })
      // res[0] += `The last adventurer `
    } else {
      res.main.push({ string: `The adventurers `, label: Label.conjunctive })
      // res[0] += `The adventurers `
    }
    if (middle.questSuccess === Success.failure) {
      res.main.push(
        { string: `slunk back to `, label: Label.conjunctive },
        { string: `${beginning.guild.name}`, label: Label.guildName },
        { string: ` in disgrace.`, label: Label.conjunctive }
      )
      // res[0] += `slunk back to ${beginning.guild.name} in disgrace.`
    } else if (middle.questSuccess === Success.mixed) {
      res.main.push(
        { string: `returned to `, label: Label.conjunctive },
        { string: `${beginning.guild.name}`, label: Label.guildName },
        { string: `, exhausted but successful.`, label: Label.conjunctive }
      )
      // res[0] += `returned to ${beginning.guild.name}, exhausted but successful.`
    } else if (middle.questSuccess === Success.success) {
      res.main.push(
        { string: `returned triumphantly to `, label: Label.conjunctive },
        { string: `${beginning.guild.name}`, label: Label.guildName },
        { string: `, basking in glory.`, label: Label.conjunctive }
      )
      // res[0] += `returned triumphantly to ${beginning.guild.name}, basking in glory.`
    }
  }
  endingResults.forEach(result => {
    res.resultTexts.push(result.text)
  })
  return res
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

export function makeInjuryText(adventurer: Adventurer, injuryString: string, ): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: insertPronouns(` ${injuryString}.`, adventurer.pronouns), label: Label.conjunctive }
  ]
}

export function makeDeathText(adventurer: Adventurer): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: ` died.`, label: Label.conjunctive }
  ]
}

export function makeLootText(adventurer: Adventurer, lootPiece: string): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: ` found `, label: Label.conjunctive },
    { string: `${lootPiece}`, label: Label.lootName },
    { string: `!`, label: Label.conjunctive }
  ]
}

export function makeSkillText(adventurer: Adventurer, skill: string): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: ` learned `, label: Label.conjunctive },
    { string: `${skill}`, label: Label.skillName },
    { string: `!`, label: Label.conjunctive }
  ]
}

export function makeTraitText(adventurer: Adventurer, trait: string): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: ` now has `, label: Label.conjunctive },
    { string: `${trait}`, label: Label.traitName },
    { string: `!`, label: Label.conjunctive }
  ]
}

export function makeKnockoutText(adventurer: Adventurer): LabeledString[] {
  return [
    { string: `${nameString(adventurer.name)}`, label: Label.adventurerName },
    { string: ` was knocked out.`, label: Label.conjunctive }
  ]
}

export function makeTriggerText(
  triggerInfo: TriggerInfo, 
  adventurer: Adventurer, 
  traits: Traits,
  qualities: string[]
): LabeledString[] {
  const res: LabeledString[] = []
  if (triggerInfo.type === "traits") {
    const trait = traits[triggerInfo.name]
    if (!trait) throw new Error("No trait")
    if (triggerInfo.modifier > 0 && trait.positiveTrigger) { 
      res.push(
        { string: `${nameString(adventurer.name)} `, label: Label.adventurerName },
        { string:  `${trait.positiveTrigger}!`, label: Label.conjunctive }
      )
    } else if (trait.negativeTrigger) {
      res.push(
        { string: `${nameString(adventurer.name)} `, label: Label.adventurerName },
        { string:  `${trait.negativeTrigger}!`, label: Label.conjunctive }
      )
    }
  } else if (triggerInfo.type === "skills") {
    res.push(
      { string: `${nameString(adventurer.name)} `, label: Label.adventurerName },
      { string: `used ${adventurer.pronouns.depPossessive} `, label: Label.conjunctive },
      { string: `${triggerInfo.name} `, label: Label.skillName },
      { string: `skills!`, label: Label.conjunctive }
    )
  } else if (triggerInfo.type === "loot") {
    let usedLoot = ""
    qualities.forEach(lootPiece => {
      const index = lootPiece.indexOf(triggerInfo.name)
      if (index >= 0) {
        usedLoot = lootPiece
      }
    })
    if (usedLoot !== "") {
      res.push(
        { string: `${nameString(adventurer.name)} `, label: Label.adventurerName },
        { string: `used ${adventurer.pronouns.depPossessive} `, label: Label.conjunctive },
        { string: `${usedLoot} `, label: Label.lootName },
        { string: `!`, label: Label.conjunctive }
      )
    }
  }
  return res
}