import React from 'react'

import Countdown from './Countdown'
import { Story, getTimeLeft, NarratorState } from '../utils'
import { WAITING_FOR_SERVER } from '../constants'

interface UpcomingStoryProps {
  story: Story
  narratorState: NarratorState
}

export default ({ story, narratorState }: UpcomingStoryProps) => {
  return (
    <>
      {getTimeLeft(story.text.nextUpdateTime) > 0 ?
        <div className="block has-text-grey">
          "They'll be leaving in <Countdown
            to={Number(story.startTime)}
            narratorState={narratorState}
          />"
        </div>
        :
        story.text.nextUpdateTime !== -1 &&
        <div className="block has-text-grey">
          {WAITING_FOR_SERVER}
        </div>
      }
    </>
  )
}