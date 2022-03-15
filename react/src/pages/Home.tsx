import React from 'react'

import GuildButtons from '../components/GuildButtons'
import Countdown, { CountdownDisplayMode } from '../components/Countdown'
import useNarratorState from '../hooks/useNarratorState'
import { getTimeLeft } from '../utils'
import LoadingAnimation from '../components/LoadingAnimation'

export default () => {
  const narratorState = useNarratorState()
  const { narrator } = narratorState

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
        narrator.collections.length > 0 &&
          narrator.collections[0].scriptResult.nextState.guilds.length > 0 ?
          <>
            <div className="block">
              A sign in the road directs you. Choose a guild:
            </div>
            <GuildButtons
              guilds={narrator.collections[narrator.collections.length - 1]?.scriptResult.nextState.guilds ?? null}
            />
          </>
          :
          getTimeLeft(Number(narrator.start)) > 0 ?
            <div className="block">
              {`Return in `}<Countdown
                to={Number(narrator.start)}
                narratorState={narratorState}
                collectionIndex={0}
                storyIndex={0}
                displayMode={CountdownDisplayMode.waiting_for_server}
              />
            </div>
            :
            <div className="block">
              <LoadingAnimation />
            </div>
      }
    </>
  )
}
