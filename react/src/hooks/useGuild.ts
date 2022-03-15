import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Guild } from '../../../scripts/src'
import { guildColor, Narrator } from '../utils'

export default (narrator: Narrator) => {
  const { guildId } = useParams()
  let color: string | null = null
  let guild: Guild | null = null
  if (guildId !== undefined) {
    const guildIndex = parseInt(guildId)
    color = guildColor(guildIndex)
    guild = getGuild(narrator, guildIndex)
    useEffect(() => {
      guild = getGuild(narrator, guildIndex)
    }, [narrator])
  }
  return { guild, color }
}

function getGuild(narrator: Narrator, guildIndex: number): Guild | null {
  if (narrator.collections.length > 0) {
    // get most recent guild state
    const collection = narrator.collections[narrator.collections.length - 1]
    if (collection === undefined) {
      return null
    }
    return collection.scriptResult.nextState.guilds[guildIndex] ?? null
  }
  return null
}
