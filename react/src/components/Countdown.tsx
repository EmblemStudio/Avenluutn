import React, { useState, useEffect } from 'react'

import { secondsToTimeString, getTimeLeft, NarratorState } from '../utils'
import { WAITING_FOR_SERVER } from '../constants'

interface CountdownProps {
  to: number;
  narratorState: NarratorState;
  collectionIndex: number;
  storyIndex: number;
  completed: boolean;
}

export default ({ to, narratorState, collectionIndex, storyIndex, completed }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(to))

  // we need an update--start query
  if (getTimeLeft(to) === 0) narratorState.queryUntilUpdate(narratorState, collectionIndex, storyIndex)

  useEffect(() => {
    if (getTimeLeft(to) === 0) return
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(to))
      if (getTimeLeft(to) === 0) {
        // we need an update--stop counting down and start query
        clearInterval(interval)
        narratorState.queryUntilUpdate(narratorState, collectionIndex, storyIndex)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <span className="has-text-grey">
      {timeLeft > 0 || completed ?
        secondsToTimeString(timeLeft)
        :
        WAITING_FOR_SERVER
      }
    </span>
  )
}