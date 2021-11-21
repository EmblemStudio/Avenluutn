import React from 'react'

import Layout from '../components/Layout'
import GuildButtons from '../components/GuildButtons'
import useNarratorReadable from '../hooks/useNarratorReadable'
import { READ_NARRATOR_PARAMS } from '../constants'

function Home() {
  const narrator = useNarratorReadable(READ_NARRATOR_PARAMS)

  return Layout(
    <>
      <div className="block">
        You have entered Avenluutn, on the edge of nowhere.
      </div>
      <div className="block">
        The humble road into town smells of grass and earth. 
        Sweet wind rustles the treetops. You feel hopeful.
      </div>
      {
        narrator ? 
          <>
            <div className="block">
              A sign in the road directs you. Choose a guild:
            </div>
            {GuildButtons(
              narrator.collections[narrator.collections.length - 1].scriptResult.nextState.guilds
            )}
          </>
        : 
          /* TODO Add a "Return in [timer]"
          <div className="block has-text-grey">
            Return in [timer]
          </div>
          */
          null
      }
    </>
  )
}

export default Home