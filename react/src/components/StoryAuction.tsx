import React, { useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants';
import { parseEther, formatEther } from '@ethersproject/units'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'

import Countdown from './Countdown'
import StoryBox from './StoryBox'
import { Story, shortAddress, presentOrPast, NotificationFunction, NarratorState } from '../utils'
import { STATUS } from '../constants'

// TODO Error notifications if not enough funds or bid not high enough

interface StoryAuctionProps {
  story: Story;
  publisher: Contract | string;
  narratorState: NarratorState;
  addNotification: NotificationFunction;
  removeNotification: NotificationFunction;
}

export default ({ story, publisher, narratorState, addNotification, removeNotification }: StoryAuctionProps) => {
  const auctionOver = presentOrPast(story.endTime.add(story.auction.duration))
  const [bid, setBid] = useState<BigNumber>(parseEther("0"))

  // TODO refresh state after transaction confirmations
  const handleSetBid = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value === null) return
    if (value === "") value = "0"
    setBid(parseEther(value))
  }

  const handleBid = () => {
    if (typeof publisher === "string") {
      addNotification("warnings", publisher)
    } else {
      publisher.signer.getAddress()
        .then(address => {
          publisher.bid(
            story.narratorIndex,
            story.collectionIndex,
            story.storyIndex,
            address,
            { value: bid }
          )
            .then((res: TransactionResponse) => {
              addNotification("status", STATUS.tx_submitted)
              res.wait().then((rec: TransactionReceipt) => {
                addNotification("status", STATUS.tx_confirmed)
                removeNotification("status", STATUS.tx_submitted)
                narratorState.updateNarrator()
              })
            })
        })
    }
  }

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
            .then((res: TransactionResponse) => {
              addNotification("status", STATUS.tx_submitted)
              res.wait().then((rec: TransactionReceipt) => {
                addNotification("status", STATUS.tx_confirmed)
                removeNotification("status", STATUS.tx_submitted)
                narratorState.updateNarrator()
              })
            })
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
        .then((res: TransactionResponse) => {
          addNotification("status", STATUS.tx_submitted)
          res.wait().then((rec: TransactionReceipt) => {
            addNotification("status", STATUS.tx_confirmed)
            removeNotification("status", STATUS.tx_submitted)
            narratorState.updateNarrator()
          })
        })
    }
  }

  return (
    <div className="container">
      <nav className="level mb-0 mt-3">
        <div className="level-item">
          <span className="pr-1">Auction time: </span>
          <Countdown
            to={Number(story.endTime.add(story.auction.duration))}
            narratorState={narratorState}
          />
        </div>
        <div className="level-item is-vertical">
          <div className="container">
            Last bid: <span className="has-text-grey">{formatEther(story.auction.amount)} ETH</span>
          </div>
          {story.auction.bidder !== AddressZero &&
            <div className="container is-size-7 has-text-grey">
              by {shortAddress(story.auction.bidder)}
            </div>
          }
        </div>
        <div className="level-item">
          {!auctionOver ?
            <div className="container has-text-centered is-flex-row">
              <div className="outer-border mr-1">
                <input className="input has-text-black is-ibm is-size-6" type="text" placeholder="0" onChange={handleSetBid} />
              </div>
              <span className="has-text-grey mr-1">ETH</span>
              <a className="button is-ghost is-underlined" onClick={handleBid}>Bid</a>
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
      <StoryBox story={story} narratorState={narratorState} />
    </div>
  )
}