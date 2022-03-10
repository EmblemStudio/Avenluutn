import React from 'react'
import { Link } from 'react-router-dom'

import useUser from '../hooks/useUser'
import { Story, getTimeLeft } from '../utils'
import { CURRENCY, DEFAULT_SHARE_PRICE, DEFAULT_SHARE } from '../constants'

export default ({ story }: { story: Story }) => {
  const { user, setUser } = useUser()
  const storyCompleted = getTimeLeft(story.endTime.toNumber()) === 0
  const share = user.shares[story.id]
  if (share === undefined && storyCompleted) return (<></>)
  if (share !== undefined) {
    let text = ""
    if (storyCompleted) {
      text = `You received a ${share.size} share`
    } else {
      text = `You own a ${share.size} share`
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
    if (user.balance < DEFAULT_SHARE_PRICE) {
      console.warn(`Too few ${CURRENCY} to purhase a share`)
      return
    }
    const newUser = Object.assign({}, user)
    newUser.shares[story.id] = {
      shareId: story.id,
      size: DEFAULT_SHARE,
      outcome: -1,
      narratorIndex: story.narratorIndex,
      collectionIndex: story.collectionIndex,
      storyIndex: story.storyIndex,
      resolved: false
    }
    newUser.balance = user.balance - DEFAULT_SHARE_PRICE
    setUser(newUser)
  }

  return (
    <a
      className="button is-ghost is-medium is-size-6 is-underlined"
      onClick={handleBuyShare}
    >
      {`Purchase a ${DEFAULT_SHARE} share for ${DEFAULT_SHARE_PRICE} ${CURRENCY}`}
    </a>
  )
}