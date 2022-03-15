import React from 'react'
import { Link } from 'react-router-dom'

import GuildHeader from '../components/GuildHeader'
import Expander from '../components/Expander'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'
import { nameString } from '../../../scripts/src/content/loot'

export default () => {
  const { narrator } = useNarratorState()
  const { guild } = useGuild(narrator)

  return (
    <>
      <GuildHeader guild={guild} selected="dossier" />
      {guild &&
        <div className="block p-4">
          <div className="block">
            On the desk lie charts and papers concerning ongoing guild activity.
          </div>
          <div className="block">
            {Object.keys(guild.adventurers).length > 0 &&
              <Expander text={`Adventurers – ${Object.keys(guild.adventurers).length}`}>
                <div className="is-underlined">
                  {Object.keys(guild.adventurers).map(id => {
                    return (
                      <Link key={id} to={`/${guild.id}/adventurers/${Number(id)}`}>
                        <div className="is-underlined has-text-white">
                          {nameString(guild.adventurers[Number(id)].name)}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Expander>
            }
          </div>
          <div className="block">
            {Object.keys(guild.graveyard).length > 0 &&
              <Expander text={`Graveyard – ${Object.keys(guild.graveyard).length}`}>
                <div className="is-underlined">
                  {Object.keys(guild.graveyard).map(id => {
                    return (
                      <Link key={id} to={`/${guild.id}/graveyard/${Number(id)}`}>
                        <div className="is-underlined has-text-white">
                          {nameString(guild.graveyard[Number(id)].name)}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Expander>
            }
          </div>
        </div>
      }
    </>
  )
}
