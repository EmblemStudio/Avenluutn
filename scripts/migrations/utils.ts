import { State } from "../src";

export function adventurerCount(state: State): number {
  let numberExisting = 0
  state.guilds.forEach(g => {
    numberExisting += Object.keys(g.adventurers).length
    numberExisting += Object.keys(g.graveyard).length
  })
  return numberExisting
}

export const alchemy = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"