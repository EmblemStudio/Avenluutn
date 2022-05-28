import React from 'react'

import UrgentMatter from '../components/UrgentMatter'
import GuildButtons from '../components/GuildButtons'
import EmbassyButton from '../components/EmbassyButton'
import Countdown, { CountdownDisplayMode } from '../components/Countdown'
import usePublisher from '../hooks/usePublisher'
import useNarratorState from '../hooks/useNarratorState'
import useNotifications from '../hooks/useNotifications'
import { getTimeLeft, firstArrayElement } from '../utils'
import LoadingAnimation from '../components/LoadingAnimation'
import { NETWORK, NARRATOR_INDICES } from '../constants'

export default () => {
  const publisher = usePublisher({
    network: NETWORK,
    narratorIndex: firstArrayElement(NARRATOR_INDICES[NETWORK])
  })
  const narratorStates = useNarratorState()
  console.log('home NSs', narratorStates)
  let { state: narratorState } = firstArrayElement(narratorStates)
  let { narrator } = narratorState
  const { addNotification, removeNotification } = useNotifications()

  return (
    <>
      <div className="block mb-6">
        <UrgentMatter
          narratorState={narratorState}
          publisher={publisher}
          addNotification={addNotification}
          removeNotification={removeNotification}
        />
      </div>
      <div className="block">
        Another day dawns in <span className="has-text-weight-bold">Avenluutn</span>, a town on the edge of nowhere.
      </div>
      <div className="block">
        You are an <span className="has-text-weight-bold">emissary</span>
        {' representing a distant sponsor, sent to help govern the adventurers here '}
        as they study and secure the mysterious wastes.
      </div>
      {
        getTimeLeft(Number(narrator.start)) === 0 &&
          narratorState.loadState === "finished" ?
          <div className="block mt-6">
            <div className="block mb-6">
              <EmbassySection />
            </div>
            <div className="block">
              <div className="has-text-centered">Read tales of adventure</div>
              <GuildButtons
                guilds={narrator.collections[narrator.collections.length - 1]?.scriptResult.nextState.guilds ?? null}
              />
            </div>
          </div>
          :
          narratorStates.length <= 1 && getTimeLeft(Number(narrator.start)) > 0 ?
            <div className="block mt-6">
              <div className="block">
                {`Return in `}<Countdown
                  to={Number(narrator.start)}
                  narratorState={narratorState}
                  collectionIndex={0}
                  storyIndex={0}
                  displayMode={CountdownDisplayMode.zeroes}
                />
              </div>
              <EmbassySection />
            </div>
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
    <div className="block p-4">
      <div className="has-text-centered">Vote and converse with fellow emissaries</div>
      <EmbassyButton />
    </div>
  )
}
