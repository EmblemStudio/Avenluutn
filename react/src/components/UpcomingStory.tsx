import React from 'react'

import { Story } from '../utils'

interface UpcomingStoryProps {
  story: Story
}

export default ({ story }: UpcomingStoryProps) => {
  return (
    <div>
      Starts at: {Number(story.startTime)}
    </div>
  )
}