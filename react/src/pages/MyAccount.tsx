import React from 'react'
import { Link } from 'react-router-dom'

import AccountHeader from '../components/AccountHeader'
import ShareOutcome from '../components/ShareOutcome'
import useUser from '../hooks/useUser'
import useNarratorState from '../hooks/useNarratorState'
import { Share, storyIdFromIndices, storyId } from '../utils'

export default () => {
  const { user } = useUser()
  const { narrator } = useNarratorState()

  return (
    <>
      <AccountHeader />
      <div className="block p-4">
        <div className="block">
          You are an emissary to Avenluutn, governing the town on behalf of your distant sponsor.
        </div>
        <div className="block">
          <div className="block is-garamond is-italic is-size-4">
            Loot Shares
          </div>
          <div className="block is-italic has-text-grey">
            While active, you may purchase shares of an adventure's loot. A little extra crin does an emissary good.
          </div>
          <div className="block">
            {Object.keys(user.shares).length > 0 ?
              Object.keys(user.shares).map((key) => {
                const share: Share = user.shares[key]
                if (share === undefined) return (<span key={key}></span>)
                const { narratorIndex, storyIndex, collectionIndex } = share
                const story = narrator.stories[storyIdFromIndices(narratorIndex, storyIndex, collectionIndex)]
                if (story === undefined) return (<span key={key}></span>)
                return (
                  <div key={key}>
                    {`Purchased loot share of `}
                    <Link to={`/${storyIndex}/stories/${collectionIndex}`}>
                      <span className="is-underlined has-text-white">{storyId(story)}</span>
                    </Link>
                    {` – `}
                    <ShareOutcome share={share} narrator={narrator} story={story} />
                  </div>
                )
              }
              )
              :
              <div>No shares purchased.</div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
