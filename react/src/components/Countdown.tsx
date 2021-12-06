import React, { useState, useEffect } from 'react'

import { secondsToTimeString, getTimeLeft } from '../utils'

interface CountdownProps { to: number }

export default ({ to }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLeft(to))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(to))
    }, 1000)
    console.log('set interval', interval)

    return () => {
      console.log('clearing interval', interval)
      clearInterval(interval)
    }
  }, [])

  return (
    <span className="has-text-grey">
      {secondsToTimeString(timeLeft)}
    </span>
  )
}