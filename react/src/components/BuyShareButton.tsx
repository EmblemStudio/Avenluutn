import React from 'react'

import useUser from '../hooks/useUser'
import { Story, getTimeLeft } from '../utils'
import { CURRENCY, DEFAULT_SHARE_PRICE, DEFAULT_SHARE } from '../constants'

export default ({ story }: { story: Story }) => {
  const { user, setUser } = useUser()
  if (getTimeLeft(Number(story.endTime)) === 0) return (<></>)

  const share = user.shares[story.id]
  if (share !== undefined) {
    return (
      <span className="is-underlined">{`You own a ${share.size} share`}</span>
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
      outcome: "placeholder",
      narratorIndex: story.narratorIndex,
      collectionIndex: story.collectionIndex,
      storyIndex: story.storyIndex
    }
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