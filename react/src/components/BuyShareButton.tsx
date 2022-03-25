import React from 'react'
import { Link } from 'react-router-dom'

import useUser from '../hooks/useUser'
import { Story, getTimeLeft, storyId } from '../utils'
import { CURRENCY, SHARE_PRICE } from '../constants'

export default ({ story }: { story: Story }) => {
  const { user, setUser } = useUser()
  const storyCompleted = getTimeLeft(story.endTime.toNumber()) === 0
  const share = user.shares[storyId(story)]
  if (share === undefined && storyCompleted) return (<></>)
  if (share !== undefined) {
    let text = ""
    if (storyCompleted) {
      text = `You received a loot share`
    } else {
      text = `You own a loot share`
    }
    return (
      <div
        className="button is-ghost is-medium is-size-6"
      >
        <Link to="/my-account">
          <span className="is-underlined is-italic has-text-white">{text}</span>
        </Link>
      </div>
    )
  }

  const handleBuyShare = () => {
    if (user.balance < SHARE_PRICE) {
      console.warn(`Too few ${CURRENCY} to purhase a share`)
      return
    }
    const newUser = Object.assign({}, user)
    newUser.shares[storyId(story)] = {
      shareId: storyId(story),
      outcome: -1,
      narratorIndex: story.narratorIndex,
      collectionIndex: story.collectionIndex,
      storyIndex: story.storyIndex,
      resolved: false
    }
    newUser.balance = user.balance - SHARE_PRICE
    setUser(newUser)
  }

  return (
    <a
      className="button is-ghost is-medium is-size-6 is-underlined"
      onClick={handleBuyShare}
    >
      {`Purchase a loot share for ${SHARE_PRICE} ${CURRENCY}`}
    </a>
  )
}