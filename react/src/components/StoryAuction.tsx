import React from 'react'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants';

import Countdown from './Countdown'
import StoryBox from './StoryBox'
import { Story, shortAddress, presentOrPast } from '../utils'

interface StoryAuctionProps {
  story: Story;
  publisher: Contract | string;
  addNotification: Function;
}

export default ({story, publisher, addNotification}: StoryAuctionProps) => {
  // console.log('story auction', story)
  const auctionOver = presentOrPast(story.endTime.add(story.auction.duration))

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
          <span className="pr-1">Time left: </span>
          <Countdown 
            to={Number(story.endTime.add(story.auction.duration))} 
          />
        </div>
        <div className="level-item is-vertical">
          <div className="container">
            Last bid: {story.auction.amount.toString()} ETH
          </div>
          {story.auction.bidder !== AddressZero &&
            <div className="container is-size-7">
              by {shortAddress(story.auction.bidder)}
            </div>
          }
        </div>
        <div className="level-item">
          {!auctionOver ? 
            <div className="container has-text-centered is-flex-row">
              <input className="input is-ibm is-size-6 mr-1" type="text" placeholder="0" />
              <span className="is-text-grey mr-1">ETH</span>
              <a className="button is-ghost is-underlined">Bid</a>
            </div>
          :
            story.minted ?
              <span className="is-italic">Claimed</span>
            :
              story.auction.bidder === AddressZero ?
                <a className="button is-ghost is-underlined" onClick={handleClaim}>Claim</a>
              :
                <a className="button is-ghost is-underlined" onClick={handleClaimFor}>Claim for Winner</a>
          }
        </div>
      </nav>
      <StoryBox story={story} />
    </div>
  )
}

// if auction is over
//   if story is minted
//     already minted 
//   else
//     if bids
//        claim for winner
//     else 
//        open claim