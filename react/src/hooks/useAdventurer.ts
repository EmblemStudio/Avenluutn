import { useParams } from 'react-router-dom'

import { Adventurer, Guild } from '../../../scripts/src'
import { Narrator } from '../utils'
import useGuild from './useGuild'

interface UseAdventurerResult {
  adventurer: Adventurer | null,
  guild: Guild | null,
  color: string | null | undefined
}

export default (narrator: Narrator, deceased: boolean): UseAdventurerResult => {
  const { guild, color } = useGuild(narrator)
  const { adventurerId } = useParams()
  if (guild === null || adventurerId === undefined) return { adventurer: null, guild, color }
  const numId = parseInt(adventurerId)
  let adventurer: Adventurer
  if (deceased) {
    adventurer = guild.graveyard[numId]
  } else {
    adventurer = guild.adventurers[numId]
  }
  if (adventurer === undefined) return { adventurer: null, guild, color }
  return { adventurer, guild, color }
}
