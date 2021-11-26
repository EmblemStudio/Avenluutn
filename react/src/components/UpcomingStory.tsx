import React from 'react'

import { Story } from '../utils'

export default (story: Story) => {
  return (
    <div key={story.collectionIndex}>
      Upcoming story
    </div>
  )
}