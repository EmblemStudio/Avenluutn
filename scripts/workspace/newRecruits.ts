import Prando from 'prando'
import { writeFileSync } from 'fs'

import { randomAdventurer, State, LabeledString, Label } from '../src/utils'
import { startingState } from '../src/startingState'
import { adventurerCount, alchemy } from './utils'
import { nameString } from '../src/content/loot'

/**
 * Create state with a new adventurer in each guild
 */

interface NewRecruitsResult {
  notifications: LabeledString[][],
  state: State
}

async function main(numberPerGuild: number): Promise<NewRecruitsResult> {
  const newState = Object.assign({}, startingState)

  let numberExisting = adventurerCount(newState)

  const notifications: LabeledString[][] = []

  for (let i = 0; i < newState.guilds.length; i++) {
    const guild = newState.guilds[i]
    if (guild === undefined) throw new Error("guild undefined")

    const adv = await randomAdventurer(
      numberExisting + 1,
      new Prando(Date.now()),
      alchemy
    )
    numberExisting += 1

    guild.adventurers[adv.id] = adv
    newState.guilds[i] = guild

    // [name] the [class] has joined [guild name]
    notifications.push([
      { string: `A new adventurer, `, label: Label.conjunctive },
      { string: nameString(adv.name), label: Label.adventurerName, entityId: adv.id },
      { string: ` the `, label: Label.conjunctive },
      { string: adv.class.join(" "), label: Label.conjunctive },
      { string: `, has joined `, label: Label.conjunctive },
      { string: guild.name, label: Label.guildName, entityId: guild.id },
      { string: `!`, label: Label.conjunctive }
    ])
  }

  const res: NewRecruitsResult = {
    notifications,
    state: newState
  }

  const path = `${__dirname}/newRecruitsState.json`
  writeFileSync(path, JSON.stringify(res))
  console.log(`Wrote new recruits state to ${path}`)
  return res
}

main(1)
  .then(r => {
    console.log('Finished')
  })
  .catch(e => {
    console.error('Error:', e)
  })