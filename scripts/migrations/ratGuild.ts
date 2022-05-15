import Prando from 'prando'
import { writeFileSync } from 'fs'

import { randomGuild, Guild, LabeledString, Label } from '../src/utils'
import { startingState } from '../src/startingState'
import { adventurerCount, alchemy } from './utils'

/**
 * Creates a new guild of all Rats
 */

interface RatGuildResult {
  notifications: LabeledString[][];
  guild: Guild;
}

async function main(): Promise<RatGuildResult> {
  const numberExisting = adventurerCount(startingState)

  const ratGuild = await randomGuild(
    startingState.guilds.length,
    new Prando(Date.now()),
    startingState,
    alchemy,
    { characters: { species: ["Rat"], numberExisting } }
  )

  const res: RatGuildResult = {
    notifications: [],
    guild: ratGuild
  }

  res.notifications.push([
    { string: 'A new guild, ', label: Label.conjunctive },
    { string: ratGuild.name, label: Label.guildName, entityId: ratGuild.id },
    { string: ', has been founded!', label: Label.conjunctive }
  ])

  const path = `${__dirname}/ratGuild.json`
  writeFileSync(path, JSON.stringify(res))
  console.log(`Wrote rat guild to ${path}`)
  return res
}

main()
  .then(r => {
    console.log('Finished')
  })
  .catch(e => {
    console.error('Error:', e)
  })