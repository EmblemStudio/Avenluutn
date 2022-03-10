import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import AccountHeader from '../components/AccountHeader'
import ShareOutcome from '../components/ShareOutcome'
import useUser from '../hooks/useUser'
import useNarratorState from '../hooks/useNarratorState'
import { SHARE_PAYOUTS } from '../constants'
import { Share, updateUserFromNarrator, outcomeString, storyId, storyName, storyCategory, StoryCategory } from '../utils'

export default () => {
  const { user, setUser } = useUser()
  const { narrator } = useNarratorState()

  useEffect(() => {
    updateUserFromNarrator(user, narrator, setUser)
  }, [narrator])

  return (
    <>
      <AccountHeader />
      <div className="block p-4">
        {Object.keys(user.shares).map((key) => {
          const share: Share = user.shares[key]
          if (share === undefined) return (<span key={key}></span>)
          const { size, storyIndex, collectionIndex } = share
          const story = narrator.stories[storyId(collectionIndex, storyIndex)]
          if (story === undefined) return (<span key={key}></span>)
          return (
            <div key={key}>
              {`${size} loot share of `}
              <Link to={`/${storyIndex}/stories/${collectionIndex}`}>
                <span className="is-underlined has-text-white">{storyName(story)}</span>
              </Link>
              {` – `}
              <ShareOutcome share={share} narrator={narrator} story={story} />
            </div>
          )
        }
        )}
      </div>
    </>
  )
}
