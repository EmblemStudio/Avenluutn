import React from 'react'

import GuildHeader from '../components/GuildHeader'
import StoryBox from '../components/StoryBox'
import Countdown, { CountdownDisplayMode } from '../components/Countdown'
import EventFeed from '../components/EventFeed'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'
import { coloredBoldStyle, Event, firstArrayElement } from '../utils'

export default () => {
  const narratorState = firstArrayElement(useNarratorState()).state
  const { narrator } = narratorState
  const { guild, color } = useGuild(narrator)

  return (
    <>
      <GuildHeader guild={guild} selected="lobby" />
      {guild &&
        <div className="block p-4">
          <div className="block">
            You enter {guild.name} in {guild.location}.
            People murmur as you enter: “the emissary!”
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
              <div className="block has-text-grey">
                "The next adventure will begin in <Countdown
                  to={narrator.stories[narrator.storiesByGuild[guild.id]?.upcoming[0]].startTime.toNumber()}
                  narratorState={narratorState}
                  collectionIndex={narrator.stories[narrator.storiesByGuild[guild.id]?.upcoming[0]].collectionIndex}
                  storyIndex={narrator.stories[narrator.storiesByGuild[guild.id]?.upcoming[0]].storyIndex}
                  displayMode={CountdownDisplayMode.zeroes}
                />"
              </div>
            </div>
          }
          {narrator.storiesByGuild[guild.id]?.inProgress.length === 0 &&
            narrator.storiesByGuild[guild.id]?.upcoming.length === 0 &&
            <div className="block">
              The crowd mills about.
            </div>
          }
          {narrator.eventsByGuild[guild.id] !== undefined &&
            <div className="block">
              <div className="is-garamond is-italic is-size-4">
                Recent Activity
              </div>
              <div className="block has-text-grey p-4">
                <EventFeed
                  narrator={narrator}
                  events={eventsForFeed(narrator.eventsByGuild[guild.id])}
                />
              </div>
            </div>
          }
        </div>
      }
    </>
  )
}

function eventsForFeed(events: Event[]): Event[] {
  if (events.length > 31) {
    return events.slice(events.length - 31).reverse()
  }
  return events.reverse()
}
