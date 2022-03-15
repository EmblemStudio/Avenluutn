import React from 'react'
import { Link } from 'react-router-dom'

import GuildButton from './GuildButton'
import { Guild } from '../../../scripts/src'
import { guildColor, coloredBoldStyle } from '../utils'
import LoadingAnimation from './LoadingAnimation'

const padding = "pl-3 pr-3"

function selectedStyles(selected: string, rendered: string, color: string): string {
  if (selected === rendered) {
    return coloredBoldStyle(color)
  }
  return " has-text-white"
}

interface GuildHeaderProps {
  guild: Guild | null;
  selected: string
}

export default ({ guild, selected }: GuildHeaderProps) => {
  if (!guild) return (
    <nav className="level">
      <div className="level-left">
        <div className={`level-item ${padding} mt-5`}>
          <LoadingAnimation />
        </div>
      </div>
    </nav>
  )

  const color = guildColor(guild.id)

  return (
    <nav className="level">
      <div className="level-left">
        {GuildButton(guild)}
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/lobby`}>
            <div className={"is-underlined" + selectedStyles(selected, "lobby", color)}>
              Lobby
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/logbook`}>
            <div className={"is-underlined" + selectedStyles(selected, "logbook", color)}>
              Logbook
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/${guild.id}/dossier`}>
            <div className={"is-underlined" + selectedStyles(selected, "dossier", color)}>
              Dossier
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to="/">
            <div className="is-underlined has-text-white">
              Back
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}