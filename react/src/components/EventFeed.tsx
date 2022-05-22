import React from 'react'
import { Link } from 'react-router-dom'

import { Event, EventType, Story, Narrator, outcomeString } from '../utils'
import { ResultType } from '../../../scripts/src'

interface EventFeedProps {
  events: Event[],
  narrator: Narrator
}

export default ({ events, narrator }: EventFeedProps) => {
  return (
    <>
      {events.map((event, i) => {
        const story = narrator.stories[event.storyId]
        const party = story?.text.party === undefined ? [] : story?.text.party
        const partyNames = party.map(adv => adv.name.firstName)
        return <EventString event={event} story={story} partyNames={partyNames} key={i} />
      })}
    </>
  )
}

interface EventProps {
  event: Event,
  story: Story,
  partyNames: string[]
}

function EventString({ event, story, partyNames }: EventProps) {
  switch (event.type) {
    case EventType.adventureStart:
      return (
        <div>
          {`• `}
          <PartyNames names={partyNames} />
          {` `}
          <Link to={`/${story.storyIndex}/stories/${story.collectionIndex}`}>
            <span className="has-text-grey is-underlined">{`chose a quest`}</span>
          </Link>
        </div>
      )
    case EventType.result:
      switch (event.result?.type) {
        case ResultType.Death:
          return (
            <div>
              {`• ${event.result?.advName.firstName} `}
              <Link to={`/${story.storyIndex}/stories/${story.collectionIndex}`}>
                <span className="has-text-grey is-underlined">
                  {`died`}
                </span>
              </Link>
            </div>
          )
        case ResultType.Knockout:
          return (
            <div>
              {`• ${event.result?.advName.firstName} was `}
              <Link to={`/${story.storyIndex}/stories/${story.collectionIndex}`}>
                <span className="has-text-grey is-underlined">
                  {`knocked out`}
                </span>
              </Link>
            </div>
          )
        case ResultType.Injury:
          return <></>
        default:
          return (
            <div>
              {`• ${event.result?.advName.firstName} +`}
              <Link to={`/${story.storyIndex}/stories/${story.collectionIndex}`}>
                <span className="has-text-grey is-underlined">
                  {`${event.result?.component}`}
                </span>
              </Link>
            </div>
          )
      }
    case EventType.adventureEnd:
      return (
        <div>
          {`• `}
          <PartyNames names={partyNames} />
          {` returned with `}
          <Link to={`/${story.storyIndex}/stories/${story.collectionIndex}`}>
            <span className="has-text-grey is-underlined">
              {`${outcomeString(story.text.finalOutcome, true).toLowerCase()}`}
            </span>
          </Link>
        </div>
      )
    default:
      return <></>
  }
}

interface PartyNamesProps { names: string[] }

function PartyNames({ names }: PartyNamesProps) {
  if (names.length === 0) return (
    <span>They</span>
  )
  return (
    <>
      {names.map((n, i) => {
        if (i < names.length - 1) {
          return <span key={i}>{`${n}, `}</span>
        }
        return <span key={i}>{`and ${n}`}</span>
      })}
    </>
  )
}