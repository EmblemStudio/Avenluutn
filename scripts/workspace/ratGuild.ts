import Prando from 'prando'
import { writeFileSync } from 'fs'

import { randomGuild } from '../src/utils'
import { startingState } from '../src/startingState'
import { adventurerCount, alchemy } from './utils'

/**
 * Creates a new guild of all Rats
 */

async function main() {
  const numberExisting = adventurerCount(startingState)

  const ratGuild = await randomGuild(
    6,
    new Prando(Date.now()),
    startingState,
    alchemy,
    { characters: { species: ["Rat"], numberExisting } }
  )

  const path = `${__dirname}/ratGuild.json`
  writeFileSync(path, JSON.stringify(ratGuild))
  console.log(`Wrote rat guild to ${path}`)
  return ratGuild
}

main()
  .then(r => {
    console.log('Finished')
  })
  .catch(e => {
    console.error('Error:', e)
  })