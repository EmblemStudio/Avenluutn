import React from 'react'
import { useStorage } from '../hooks/useStorage'
import { currencyName } from '../constants'
import Countdown from '../components/Countdown'
import { getTimeLeft, Bet } from '../utils'



function viewOutcome (outcome: string): string {
  if (outcome === "GreatSuccess") { return "Great Success" }
  if (outcome === "Success" || outcome === "Failure") { return outcome }
  return "Unknown Outcome"
}

export default () => {
  const [bets, setBets] = useStorage("bets", [])
  console.log("bets", bets)
  console.log(bets)
  return (
    <div>
      My Bets (Bets are not completely implemented yet...)
      {bets.map((bet: Bet) => {
        const { betId, amount, guild, story, outcome }: Bet = bet
        console.log(amount)
        return (
          <div key={betId}>
            {amount} {currencyName} on {guild.name} {viewOutcome(outcome)}!
          </div>
        )
      })}
    </div>
  )
}
