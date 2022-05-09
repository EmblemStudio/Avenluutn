import Prando from 'prando'
import { writeFileSync } from 'fs'

import { randomGuild } from '../src/utils'
import { startingState } from '../src/startingState'

async function main() {
  let numberExisting = 0
  startingState.guilds.forEach(g => {
    numberExisting += Object.keys(g.adventurers).length
    numberExisting += Object.keys(g.graveyard).length
  })

  const ratGuild = await randomGuild(
    6,
    new Prando(Date.now()),
    startingState,
    "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm",
    { characters: { species: ["Rat"], numberExisting } }
  )
  ratGuild.bard.age = Math.ceil(ratGuild.bard.age / 10)
  for (const id in ratGuild.adventurers) {
    const adv = ratGuild.adventurers[Number(id)]
    if (adv !== undefined) {
      adv.age = Math.ceil(adv.age / 10)
      ratGuild.adventurers[Number(id)] = adv
    }
  }
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