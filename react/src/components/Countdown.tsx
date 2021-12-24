import React, { useState, useEffect } from 'react'

import { secondsToTimeString, getTimeLeft } from '../utils'
import useNarratorState from '../hooks/useNarratorState'

interface CountdownProps { to: number, collectionIndex: number }

export default ({ to, collectionIndex }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(to))
  const narratorState = useNarratorState()
  console.log('Countdown', to, collectionIndex)

  useEffect(() => {
    console.log('Countdown use effect')
    if (getTimeLeft(to) === 0) return
    const interval = setInterval(() => {
      console.log('Countdown interval')
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