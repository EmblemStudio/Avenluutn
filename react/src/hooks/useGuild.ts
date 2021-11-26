import { useParams } from 'react-router-dom'

import { Guild } from '../../../scripts/src'
import { guildColor, Narrator } from '../utils'

export default (narrator: Narrator) => {
  const { guildId } = useParams()
  let color: string | null = null
  let guild: Guild | null = null
  if (guildId) {
    const guildIndex = parseInt(guildId)
    color = guildColor(guildIndex)
    if (narrator.collections.length > 0) {
      // get most recent guild state
      guild = narrator.collections[narrator.collections.length - 1]
        .scriptResult.nextState.guilds[guildIndex]
    }
  }
  return { guild, color }
}