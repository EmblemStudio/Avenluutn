import narratorState from '../state/narratorState'
import { Narrator } from '.'

export function setNarratorState(newNarrator: Narrator) {
  narratorState.narrator = newNarrator
  narratorState.lastUpdate = Date.now()
}