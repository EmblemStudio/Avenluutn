import React from 'react'
import { useStorage } from '../hooks/useStorage'
import { currencyName } from '../constants'
import Countdown from '../components/Countdown'
import { getTimeLeft } from '../utils'

const outcomeViews = {
  GreatSuccess: "Great Success",
  Success: "Success",
  Failure: "Failure",
}

export default () => {
  const [bets, setBets] = useStorage("bets", [])
  return (
    <div>
      My Bets
      {bets.map(([betId, amount, guild, story, outcome]) => {
        return (
          <div key={betId}>
            {amount} {currencyName} on {guild.name} {outcomeViews[outcome]} in {<Countdown to={story.endTime} />}
          </div>
        )
      })}
    </div>
  )
}
