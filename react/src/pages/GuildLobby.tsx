import React from 'react'

import Layout from '../components/Layout'
import GuildHeader from '../components/GuildHeader'
import useNarratorReadable from '../hooks/useNarratorReadable'
import useGuild from '../hooks/useGuild'
import { READ_NARRATOR_PARAMS } from '../constants'
import { coloredBoldStyle } from '../utils'

export default () => {
  const narrator = useNarratorReadable(READ_NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)

  return Layout(
    <>
      { narrator && guild ? 
        <>
          {GuildHeader(guild, "lobby")}
          <div className="section pt-2">
            <div className="block">
              You enter {guild.name} in {guild.location}.
            </div>
            <div className="block">
              {"A plaque over the door reads "}
              <span className={coloredBoldStyle(color)}>
                {`"${guild.motto}"`}
              </span>
              .
            </div>
            <div className="block">
              {narrator.collections[guild.id].scriptResult.stories[0].plainText}
              {
                // for each of this guild's stories (for each collection, the guild.id'th story)
                // if the story is ended, render nothing (render a story auction on the auctions page or logbook)
                // if the story has started and hasn't ended, render an in-progress story
                // if the story hasn't started, render an upcoming story
              }
            </div>
          </div>
        </>
      :
        null
      }
    </>
  )
}