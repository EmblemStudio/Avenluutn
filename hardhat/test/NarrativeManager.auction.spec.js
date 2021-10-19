const { expect } = require("chai")
const { ethers, network } = require("hardhat")

const {
  NFTAddress,
  minBidAmount,
  minBidIncrementPercentage,
  start,
  getPublisher,
  setNextBlockTime
}= require('./utils')

describe("Stories Auctions", () => {
  let stories
  let bobBid
  let carolBid
  let currentBlockTime = 2000000000000
  let startTime        = 2100000000000
  const totalNarratives = 3
  const storyLength = 10
  const baseAuctionDuration = 100
  const timeBuffer = 50
  const storySpacing = 1000
  const copies = 1

  let alice, bob, carol


  function mkBidder(wallet) {
    return async function (
      narratorIndex,
      storyIndex,
      copyIndex,
      bidAmount,
      blockTime
    ) {
      await setNextBlockTime(blockTime)
      const walletStories = stories.connect(wallet)
      return walletStories.bid(
        narratorIndex,
        storyIndex,
        copyIndex,
        await wallet.getAddress(),
        { value: bidAmount }
      )
    }
  }

  beforeEach(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: []
    })
    currentBlockTime = 2000000000000
    ;[alice, bob, carol] = await ethers.getSigners()
    stories = await getPublisher({
      baseAuctionDuration,
      timeBuffer
    })
    const bobStories = stories.connect(bob)
    await setNextBlockTime(currentBlockTime)
    stories.addNarrator(
      NFTAddress,
      1,
      startTime,
      totalNarratives,
      storyLength,
      storySpacing,
      copies
    )
    bobBid = mkBidder(bob)
    carolBid = mkBidder(carol)
  })

  it("Rejects bids before the story ends", async () => {
    currentBlockTime = startTime + storyLength - 1 // narrator start time
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Rejects bids after the auction ends", async () => {
    currentBlockTime = startTime + storyLength + baseAuctionDuration
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Accepts only winning bids when the auction is open", async () => {
    currentBlockTime = startTime + storyLength // story end time
    await expect(bobBid(1, 0, 0, minBidAmount.add(2), currentBlockTime))
      .not.to.be.reverted

    currentBlockTime += 2
    await expect(carolBid(1, 0, 0, minBidAmount.add(1), currentBlockTime))
      .to.be.revertedWith("Bid increment too low")
  })

  it("Stops bids that are too small", async () => {
    currentBlockTime = startTime + storyLength // auction start

    await expect(bobBid(1, 0, 0, minBidAmount - 1, currentBlockTime))
      .to.be.revertedWith("Bid below minimum bid amount")

    currentBlockTime += 2
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .not.to.be.reverted

    currentBlockTime += 2
    await setNextBlockTime(currentBlockTime)
    const minIncrementBid = minBidAmount.add(
      minBidAmount * minBidIncrementPercentage / 100
    )

    await expect(bobBid(1, 0, 0, minIncrementBid - 1, currentBlockTime))
      .to.be.revertedWith("Bid increment too low")

    currentBlockTime += 1
    await setNextBlockTime(currentBlockTime)
    await expect(bobBid(1, 0, 0, minIncrementBid, currentBlockTime))
      .not.to.be.reverted
  })

  it("Only extends on bids within `timeBuffer` of the end", async () => {
    currentBlockTime =
      startTime
      + storyLength
      + baseAuctionDuration
      - timeBuffer
    // should not extend
    await bobBid(1, 0, 0, minBidAmount, currentBlockTime)
    const storyId = await stories.getStoryId(1, 0, 0)
    let story = await stories.stories(storyId)
    expect(story.auction.duration).to.equal(baseAuctionDuration)

    currentBlockTime += 21
    // should extend by 20 (setting block times seems to be off by 1)
    await carolBid(1, 0, 0, minBidAmount.mul(2), currentBlockTime)
    story = await stories.stories(storyId)
    expect(story.auction.duration).to.equal(baseAuctionDuration + 20)

    // the end of the auction
    currentBlockTime += timeBuffer - 1
    await expect(bobBid(1, 0, 0, minBidAmount.mul(3), currentBlockTime))
      .not.to.be.reverted
    story = await stories.stories(storyId)
    expect(
      story.auction.duration
    ).to.equal(
      // add in all previous extensions
      baseAuctionDuration + 20 + timeBuffer - 1
    )

    currentBlockTime += timeBuffer
    await expect(carolBid(1, 0, 0, minBidAmount.mul(4), currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })
})
