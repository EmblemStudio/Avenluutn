import React, { useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'

import { Story, shortAddress, secondsToTimeString, presentOrPast } from '../utils'
import StoryBox from './StoryBox'

interface StoryAuctionProps {
  story: Story;
  publisher: Contract | string;
  addNotification: Function;
}

export default ({story, publisher, addNotification}: StoryAuctionProps) => {
  return (
    <div className="container">
      <nav className="level mb-0 mt-5">
        <div className="level-item">
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
            "Bid Button"
          :
            story.auction.amount.isZero() ?
              <a className="button is-ghost" onClick={() => {
                if (typeof publisher === "string") { 
                  console.log(publisher)
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
              }}>Claim</a>
            :
              <a className="button is-ghost" onClick={() => {

              }}>Claim for Winner</a>
          }
        </div>
      </nav>
      {StoryBox(story)}
    </div>
  )
}