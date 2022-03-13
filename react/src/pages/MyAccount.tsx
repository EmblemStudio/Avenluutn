import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import AccountHeader from '../components/AccountHeader'
import ShareOutcome from '../components/ShareOutcome'
import useUser from '../hooks/useUser'
import useNarratorState from '../hooks/useNarratorState'
import { Share, updateUserFromNarrator, storyIdFromIndices, storyId } from '../utils'

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
          const { size, narratorIndex, storyIndex, collectionIndex } = share
          const story = narrator.stories[storyIdFromIndices(narratorIndex, storyIndex, collectionIndex)]
          if (story === undefined) return (<span key={key}></span>)
          return (
            <div key={key}>
              {`${size} loot share of `}
              <Link to={`/${storyIndex}/stories/${collectionIndex}`}>
                <span className="is-underlined has-text-white">{storyId(story)}</span>
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
