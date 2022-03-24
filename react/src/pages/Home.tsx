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
        Congratulations, newly appointed Emissary!
      </div>
      <div className="block">
        You have entered Avenluutn, a town on the edge of nowhere,
        created by the alliance for the purpose of studying and securing the mysterious wastes.
        You have been sent here as an Emissary to govern the town of adventurers who have taken up this task.
      </div>
      {
        narrator.collections.length > 0 &&
          narrator.collections[0].scriptResult.nextState.guilds.length > 0 ?
          <>
            <div className="block">
              Signs point to Avenluutn’s many adventuring guilds. Will you visit one?
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
