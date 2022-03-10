import React, { useEffect } from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryBox from '../components/StoryBox'
import UpcomingStory from '../components/UpcomingStory'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'
import useUser from '../hooks/useUser'
import { coloredBoldStyle, updateUserFromNarrator } from '../utils'

export default () => {
  const narratorState = useNarratorState()
  const { narrator } = narratorState
  const { user, setUser } = useUser()
  const { guild, color } = useGuild(narrator)

  useEffect(() => {
    updateUserFromNarrator(user, narrator, setUser)
  }, [narrator])

  return (
    <>
      <GuildHeader guild={guild} selected="lobby" />
      {guild &&
        <div className="block p-4">
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
          {narrator.storiesByGuild[guild.id]?.inProgress[0] &&
            <div className="block mb-4">
              <div className="block">
                Adventurers from {guild.name} have set forth. The bard tells their tales:
              </div>
              <StoryBox
                story={narrator.stories[narrator.storiesByGuild[guild.id]?.inProgress[0]]}
                narratorState={narratorState}
              />
            </div>
          }
          {narrator.storiesByGuild[guild.id]?.upcoming[0] &&
            <div className="block">
              <div className="block">
                The bard indicates a shadowed crew in the corner:
              </div>
              <UpcomingStory
                story={narrator.stories[narrator.storiesByGuild[guild.id]?.upcoming[0]]}
                narratorState={narratorState}
              />
            </div>
          }
          {narrator.storiesByGuild[guild.id]?.inProgress.length === 0 &&
            narrator.storiesByGuild[guild.id]?.upcoming.length === 0 &&
            <div className="block">
              People mill about.
            </div>
          }

        </div>
      }
    </>
  )
}
