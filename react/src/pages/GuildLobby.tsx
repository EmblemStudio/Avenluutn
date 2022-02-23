import React from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryBox from '../components/StoryBox'
import UpcomingStory from '../components/UpcomingStory'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'
import { coloredBoldStyle } from '../utils'

export default () => {
  const { narrator } = useNarratorState()
  const { guild, color } = useGuild(narrator)

  return (
    <>
      <GuildHeader guild={guild} selected="lobby"/>
      <div className="block p-4">
        {guild && <>
          <div className="block">
            You enter {guild.name} in {guild.location}.
          </div>
          <div className="block">
            {"A plaque over the door reads "}
            <span className={coloredBoldStyle(color ?? null)}>
              "{guild.motto}"
            </span>
            .
          </div>
          {narrator.stories[guild.id]?.inProgress[0] && 
            <div className="block mb-4">
              <div className="block">
                Adventurers from {guild.name} have set forth. The bard tells their tales:
              </div>
              {narrator.stories[guild.id]?.inProgress.map(s => {
                return <StoryBox key={s.collectionIndex} story={s}/>
              })}
            </div>
          }
          {narrator.stories[guild.id]?.upcoming[0] &&
            <div className="block">
              <div className="block">
                The bard indicates a shadowed crew in the corner:
              </div>
              <UpcomingStory story={narrator.stories[guild.id]?.upcoming[0]} />
            </div>
          }
          {narrator.stories[guild.id]?.inProgress.length === 0 && 
            narrator.stories[guild.id]?.upcoming.length === 0 &&
            <div className="block">
              People mill about.
            </div>
          }
        </>}
      </div>
    </>
  )
}
