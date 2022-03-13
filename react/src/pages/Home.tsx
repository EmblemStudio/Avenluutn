import React, { useEffect } from 'react'

import GuildButtons from '../components/GuildButtons'
import Countdown from '../components/Countdown'
import useNarratorState from '../hooks/useNarratorState'
import useUser from '../hooks/useUser'
import { getTimeLeft, updateUserFromNarrator } from '../utils'
import LoadingAnimation from '../components/LoadingAnimation'

export default () => {
  const narratorState = useNarratorState()
  const { narrator } = narratorState
  const { user, setUser } = useUser()

  useEffect(() => {
    updateUserFromNarrator(user, narrator, setUser)
    console.log('narrator', narrator)
  }, [narrator])

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
          getTimeLeft(Number(narrator.start)) > 0 ?
            <div className="block">
              <Countdown
                to={Number(narrator.start)}
                narratorState={narratorState}
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
