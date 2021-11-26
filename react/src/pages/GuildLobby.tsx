import React from 'react'

import GuildHeader from '../components/GuildHeader'
import UpcomingStory from '../components/UpcomingStory'
import StoryInProgress from '../components/StoryInProgress'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'
import { coloredBoldStyle } from '../utils'

export default () => {
  const narrator = useNarratorState()
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
            <span className={coloredBoldStyle(color)}>
              "{guild.motto}"
            </span>
            .
          </div>
        </>}
        <div className="block">
          {narrator.stories.inProgress.map(s => { 
            return StoryInProgress(s)
          })}
          {narrator.stories.upcoming.map(s => { 
            return UpcomingStory(s)
          })}
        </div>
      </div>
    </>
  )
}