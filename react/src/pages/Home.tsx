import React from 'react'
import { Link } from 'react-router-dom'

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
        Another day dawns in Avenluutn, a town on the edge of nowhere,
        created to study and secure the mysterious wastes.
      </div>
      <div className="block">
        You have been sent here as an Emissary to help govern this town of adventurers.
      </div>
      {
        narrator.collections.length > 0 &&
          narrator.collections[0].scriptResult.nextState.guilds.length > 0 ?
          <>
            <div className="block">
              Signs point to Avenluutn’s many adventuring guilds:
            </div>
            <GuildButtons
              guilds={narrator.collections[narrator.collections.length - 1]?.scriptResult.nextState.guilds ?? null}
            />
            <EmbassySection />
          </>
          :
          getTimeLeft(Number(narrator.start)) > 0 ?
            <>
              <div className="block">
                {`Return in `}<Countdown
                  to={Number(narrator.start)}
                  narratorState={narratorState}
                  collectionIndex={0}
                  storyIndex={0}
                  displayMode={CountdownDisplayMode.waiting_for_server}
                />
              </div>
              <EmbassySection />
            </>
            :
            <div className="block">
              <LoadingAnimation />
            </div>
      }
    </>
  )
}

function EmbassySection() {
  return (
    <>
      <div className="block">
        Behind you lies the Embassy, where emissaries such as you converse and collude:
      </div>
      <div className="level-item m-3">
        <a href="https://discord.gg/kYcBdKa4eE" target="_blank">
          <div className={`guild-button outer-border has-text-white`}>
            <div className={`container has-text-centered inner-border has-text-white pt-3 pb-3`}>
              <div className="block">
                Embassy
              </div>
            </div>
          </div>
        </a>
      </div>
    </>
  )
}
