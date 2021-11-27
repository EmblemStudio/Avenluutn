import React from 'react'
import { Contract } from '@ethersproject/contracts'

import { Story, shortAddress, secondsToTimeString } from '../utils'
import StoryBox from './StoryBox'

interface StoryAuctionProps {
  story: Story;
  publisher: Contract | string;
  addNotification: Function;
}

export default ({story, publisher, addNotification}: StoryAuctionProps) => {
  const handleClaim = () => {
    if (typeof publisher === "string") { 
      addNotification("warnings", publisher)
    } else {
      publisher.signer.getAddress()
        .then(address => {
          publisher.mint(
            story.narratorIndex, 
            story.collectionIndex, 
            story.storyIndex,
            address
          )
        })
    }
  }

  const handleClaimFor = () => {
    if (typeof publisher === "string") { 
      addNotification("warnings", publisher)
    } else {
      publisher.mint(
        story.narratorIndex, 
        story.collectionIndex, 
        story.storyIndex,
        story.auction.bidder
      )
    }
  }

  return (
    <div className="container">
      <nav className="level mb-0 mt-5">
        <div className="level-item">
          {/* TODO timer should count down if not at 0 */}
          Time left: {secondsToTimeString(story.auction.duration.toNumber())}
        </div>
        <div className="level-item is-vertical">
          <div className="container">
            Last bid: {story.auction.amount.toString()} ETH
          </div>
          <div className="container is-size-7">
            by {shortAddress(story.auction.bidder)}
          </div>
        </div>
        <div className="level-item">
          {story.auction.duration.gt(0) ? 
            // TODO small bid form
            "Bid Button"
          :
            story.auction.amount.isZero() ?
              <a className="button is-ghost" onClick={handleClaim}>Claim</a>
            :
              <a className="button is-ghost" onClick={handleClaimFor}>Claim for Winner</a>
          }
        </div>
      </nav>
      {StoryBox(story)}
    </div>
  )
}