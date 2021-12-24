import React from 'react'

import Countdown from './Countdown'
import { Story, getTimeLeft } from '../utils'
import { WAITING_FOR_SERVER } from '../constants'

interface UpcomingStoryProps {
  story: Story
}

export default ({ story }: UpcomingStoryProps) => {
  return (
    <>
      {getTimeLeft(story.text.nextUpdateTime) > 0 ?
        <div className="block has-text-grey">
          "They'll be leaving in <Countdown 
            to={Number(story.startTime)} 
            collectionIndex={story.collectionIndex}
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