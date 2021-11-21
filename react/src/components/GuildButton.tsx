import React from 'react'
import { Link } from 'react-router-dom'

import { Guild } from '../../../scripts/src'
import { guildColor } from '../utils'

export default (guild: Guild) => {
  const color = guildColor(guild.id)

  return (
    <div key={guild.id} className="level-item m-3">
      <Link to={`/${guild.id}/lobby`}>
        <div className={`guild-card outer-border has-border-${color}`}>
          <div className={`container has-text-centered inner-border has-border-${color} has-text-${color} pt-3 pb-3`}>
            <div className="block">
              {guild.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}