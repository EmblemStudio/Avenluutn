import React from 'react'

import { Guild } from '../../../scripts/src'
import GuildButton from './GuildButton'

export default ({ guilds }: { guilds: Guild[] }) => {
  return (
    <div className="level does-wrap">
      { guilds.map(g => GuildButton(g)) }
    </div>
  )
}