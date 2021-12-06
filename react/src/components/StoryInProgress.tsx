import React from 'react'

import StoryBox from './StoryBox'
import { Story, storyName } from '../utils'

interface StoryInProgressProps {
  story: Story
}

export default ({ story }: StoryInProgressProps) => {
  return (
    <div className="container">
      <StoryBox story={story} />
    </div>
  )
}