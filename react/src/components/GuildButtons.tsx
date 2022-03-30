import React from 'react'

import { Guild } from '../../../scripts/src'
import GuildButton from './GuildButton'

export default ({ guilds }: { guilds: Guild[] | null }) => {
  // TODO make this missing guilds message configurable
  return (
    <div className="level mb-0 does-wrap">
      {guilds?.map(g => GuildButton(g)) ?? "Guilds are shrouded beyond time."}
    </div>
  )
}