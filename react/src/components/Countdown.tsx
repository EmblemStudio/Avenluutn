import React, { useState, useEffect } from 'react'

import { secondsToTimeString, getTimeLeft, NarratorState } from '../utils'
import { WAITING_FOR_SERVER } from '../constants'

export enum CountdownDisplayMode {
  zeroes,
  waiting_for_server
}

interface CountdownProps {
  to: number;
  narratorState: NarratorState;
  collectionIndex: number;
  storyIndex: number;
  displayMode: CountdownDisplayMode;
}

export default ({ to, narratorState, collectionIndex, storyIndex, displayMode }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(to))

  // we need an update--start query
  if (getTimeLeft(to) === 0 && displayMode === CountdownDisplayMode.waiting_for_server)
    narratorState.queryUntilUpdate(narratorState, collectionIndex, storyIndex)

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
      {timeLeft > 0 || displayMode === CountdownDisplayMode.zeroes ?
        secondsToTimeString(timeLeft)
        :
        WAITING_FOR_SERVER
      }
    </span>
  )
}