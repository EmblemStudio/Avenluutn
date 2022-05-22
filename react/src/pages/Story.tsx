import React, { useEffect } from 'react'

import LoadingAnimation from '../components/LoadingAnimation'
import useNarratorState from '../hooks/useNarratorState'
import useStory from '../hooks/useStory'
import usePublisher from '../hooks/usePublisher'
import useNotifications from '../hooks/useNotifications'
import { StoryCategory, firstArrayElement } from '../utils'
import StoryBox from '../components/StoryBox'
import StoryAuction from '../components/StoryAuction'
import { NARRATOR_PARAMS } from '../constants'

export default () => {
  const narratorStates = useNarratorState()
  const narratorState = firstArrayElement(narratorStates).state
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { addNotification, removeNotification } = useNotifications()
  const { story, category } = useStory(narratorState.narrator)

  useEffect(() => { }, [narratorState])

  if (story === null || category === StoryCategory.unknown) return (
    <nav className="level">
      <div className="level-left">
        <div className={`level-item pl-3 pr-3 mt-5`}>
          <LoadingAnimation />
        </div>
      </div>
    </nav>
  )

  if (category === StoryCategory.onAuction) return (
    <StoryAuction
      story={story}
      addNotification={addNotification}
      removeNotification={removeNotification}
      publisher={publisher}
      narratorState={narratorState}
    />
  )

  return (
    <StoryBox
      story={story}
      narratorState={narratorState}
    />
  )
}
