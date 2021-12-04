import React from 'react'

import GuildButtons from '../components/GuildButtons'
import useNarratorState from '../hooks/useNarratorState'
import { NARRATOR_PARAMS, LOADING } from '../constants'

export default () => {
  const narrator = useNarratorState()

  return (
    <>
      <div className="block">
        You have entered Avenluutn, on the edge of nowhere.
      </div>
      <div className="block">
        The humble road into town smells of grass and earth.
        Sweet wind rustles the treetops. You feel hopeful.
      </div>
      {
        narrator.collections.length > 0 ?
          <>
            <div className="block">
              A sign in the road directs you. Choose a guild:
            </div>
            <GuildButtons
              guilds={narrator.collections[narrator.collections.length - 1]?.scriptResult.nextState.guilds ?? null}
            />
          </>
        :
          /* TODO Add a "Return in [timer]"
          <div className="block has-text-grey">
            Return in [timer]
          </div>
          */
          <div className="block">
            {LOADING}
          </div>
      }
    </>
  )
}
