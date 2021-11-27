import React from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useNotifications from '../hooks/useNotifications'
import useGuild from '../hooks/useGuild'
import { coloredBoldStyle } from '../utils'
import { NARRATOR_PARAMS } from '../constants'

export default () => {
  const narrator = useNarratorState()
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)
  const { addNotification } = useNotifications()

  return (
    <>
      <GuildHeader guild={guild} selected="auctions"/>
      <div className="block p-4">
        {guild && <>
          <div className="block">
            New pages for the guild logbook are being auctioned. Will you sponsor these quests?
          </div>
        </>}
        <div className="block">
          {narrator.stories.onAuction.map(s => { 
            return <StoryAuction 
              key={s.collectionIndex} 
              publisher={publisher}
              story={s} 
              addNotification={addNotification}
            />
          })}
        </div>
      </div>
    </>
  )
}