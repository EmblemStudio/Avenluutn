import React from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useNotifications from '../hooks/useNotifications'
import useGuild from '../hooks/useGuild'
import { NARRATOR_PARAMS } from '../constants'

export default () => {
  const { narrator } = useNarratorState()
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { guild } = useGuild(narrator)
  const { addNotification, removeNotification } = useNotifications()

  return (
    <>
      <GuildHeader guild={guild} selected="auctions"/>
      <div className="block p-4">
        {guild && 
          (narrator.stories[guild.id]?.onAuction.length > 0 ?
            <>
              <div className="block">
                New pages for the guild logbook are being auctioned. Will you sponsor these quests?
              </div>
              <div className="block">
                {narrator.stories[guild.id]?.onAuction.map(s => { 
                  return <StoryAuction 
                    key={s.collectionIndex} 
                    publisher={publisher}
                    story={s} 
                    addNotification={addNotification}
                    removeNotification={removeNotification}
                  />
                })}
              </div>
            </>
          :
            <div className="block">
              The auction house lies silent.
            </div>
          )
        }
      </div>
    </>
  )
}