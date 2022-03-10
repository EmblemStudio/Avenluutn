import React, { useState, useEffect } from 'react'

import { secondsToTimeString, getTimeLeft, NarratorState } from '../utils'

interface CountdownProps { to: number, narratorState: NarratorState }

export default ({ to, narratorState }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(to))

  useEffect(() => {
    if (getTimeLeft(to) === 0) return
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(to))
      if (getTimeLeft(to) === 0) {
        // we need an update--stop counting down and start query
        clearInterval(interval)
        narratorState.queryUntilUpdate(narratorState)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <span className="has-text-grey">
      {secondsToTimeString(timeLeft)}
    </span>
  )
}