import React from 'react'
import { useContext } from 'react'
import UserContext from '../providers/UserContext'
import { useStorage } from '../hooks/useStorage'
import { Story, Bet, guildColor } from '../utils'
import { currencyName, defaultBetAmount } from '../constants'
import { Guild } from '../../../scripts/src'

interface BetOfferProps { story: Story, guild: Guild }

// TODO make Success, Failure, GreatSuccess enums.

export default ({ story, guild }: BetOfferProps) => {
  const betId = `${story.narratorIndex}-${story.storyIndex}-${story.collectionIndex}`
  const [bet, setBet] = useStorage(betId, "")
  const [bets, setBets] = useStorage("bets", [])
  const [balance, setBalance] = useStorage("balance", 1000)
  const { user, setUser } = useContext(UserContext)

  function handleBet(outcome: string) {
    if (bet !== "") {
      console.log("already bet on", story)
      return
    }

    bets.push({betId, amount: defaultBetAmount, guild, story, outcome})
    setBets(bets)
    setBet(outcome)
    const newBalance = balance - defaultBetAmount
    setBalance(newBalance)
    setUser({ balance, bets })
  }

  if (balance < defaultBetAmount) {
    return (
      <div>
        {"You don't have enough crin to bet"}
      </div>
    )
  }

  return bet !== "" ? (
    <div>
      You bet {defaultBetAmount} {currencyName} on {bet}!
    </div>
  ) : (
  <div>
      Will you bet {defaultBetAmount} {currencyName} on...
    <br />
    <a className="button is-ghost is-underlined" onClick={() => handleBet("Success")}>Success?</a>
    <a className="button is-ghost is-underlined" onClick={() => handleBet("Failure")}>Failure?</a>
    <a className="button is-ghost is-underlined" onClick={() => handleBet("GreatSuccess")}>Great Success?</a>
  </div>
  )
}
