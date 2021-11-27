import React from 'react'

import { Story } from '../utils'

interface StoryInProgressProps {
  story: Story
}

export default ({ story }: StoryInProgressProps) => {
  return (
    <div>
      {story.text.plainText}
    </div>
  )
}