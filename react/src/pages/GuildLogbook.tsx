import React, { useState } from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import StoryExpander from '../components/StoryExpander'
import useNotifications from '../hooks/useNotifications'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useGuild from '../hooks/useGuild'
import { NARRATOR_PARAMS } from '../constants'
import { coloredBoldStyle, storyName } from '../utils'

export default () => {
  const narrator = useNarratorState()
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)
  const [expanders, setExpanders] = useState<{ [key: number]: boolean }>({})
  const { addNotification } = useNotifications()

  return (
    <>
      <GuildHeader guild={guild} selected="logbook"/>
      <div className="block p-4">
        {guild && <>
          <div className="block">
            {"The logbook is engraved with the guild motto: "} 
            <span className={coloredBoldStyle(color)}>
              “{guild.motto}”
            </span>
            . It records deeds past:
          </div>
          { narrator.stories[guild.id].completed.length === 0 ?
            <div className="block">
              "The pages are blank."
            </div>
          :
            <div className="block">
              {narrator.stories[guild.id].completed.map(s => {
                  return (
                    <StoryExpander 
                      key={s.collectionIndex} 
                      index={s.collectionIndex} 
                      name={storyName(s)} 
                      expanders={expanders} 
                      setExpanders={setExpanders}
                    >
                      <StoryAuction story={s} publisher={publisher} addNotification={addNotification} />
                    </StoryExpander>
                  )
                })
              }
            </div>
          }
        </>}
      </div>
    </>
  )
}