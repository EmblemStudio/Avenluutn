import React from 'react'
import { Link } from 'react-router-dom'

import GuildButton from './GuildButton'
import { Guild } from '../../../scripts/src'
import { guildColor } from '../utils'

const padding = "pl-6"

function selectedStyles(selected: string, rendered: string, color: string): string {
  if (selected === rendered) {
    return ` has-text-${color} has-text-weight-bold`
  }
  return " has-text-white"
}

export default (guild: Guild, selected: string) => {
  const color = guildColor(guild.id)

  return (
    <nav className="level">
      <div className="level-left">
        {GuildButton(guild)}
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/lobby`}>
            <div className=
              {"is-ghost is-underlined" + 
              selectedStyles(selected, "lobby", color)}
            >
              Lobby
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/auctions`}>
          <div className=
              {"is-ghost is-underlined" + 
              selectedStyles(selected, "auctions", color)}
            >
              Auctions
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/logbook`}>
            <div className=
              {"is-ghost is-underlined" + 
              selectedStyles(selected, "logbook", color)}
            >
              Logbook
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to="/">
            <div className="is-ghost is-underlined has-text-white">
              Back
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}