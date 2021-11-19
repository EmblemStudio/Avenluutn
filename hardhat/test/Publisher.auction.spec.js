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
  let publisher
  let bobBid
  let bobMint
  let carolBid
  let currentBlockTime = 2000000000000
  let startTime        = 2100000000000

  const totalCollections    = 3
  const collectionLength    = 10
  const baseAuctionDuration = 100
  const timeBuffer          = 50
  const collectionSpacing   = 1000
  const collectionSize      = 1

  let alice, bob, carol

  function mkBidder(wallet) {
    return async function (
      narratorIndex,
      collectionIndex,
      storyIndex,
      bidAmount,
      blockTime
    ) {
      await setNextBlockTime(blockTime)
      const walletPublisher = publisher.connect(wallet)
      return walletPublisher.bid(
        narratorIndex,
        collectionIndex,
        storyIndex,
        await wallet.getAddress(),
        { value: bidAmount }
      )
    }
  }

  function mkMinter(wallet) {
    return async function (
      narratorIndex,
      collectionIndex,
      storyIndex,
      blockTime
    ) {
      await setNextBlockTime(blockTime)
      const walletPublisher = publisher.connect(wallet)
      return walletPublisher.mint(
        narratorIndex,
        collectionIndex,
        storyIndex,
        await wallet.getAddress()
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
    publisher = await getPublisher({
      baseAuctionDuration,
      timeBuffer
    })
    const bobPublisher = publisher.connect(bob)
    await setNextBlockTime(currentBlockTime)
    publisher.addNarrator(
      NFTAddress,
      1,
      startTime,
      totalCollections,
      collectionLength,
      collectionSpacing,
      collectionSize
    )
    bobBid = mkBidder(bob)
    bobMint = mkMinter(bob)
    carolBid = mkBidder(carol)
  })

  it("Rejects bids before the story ends", async () => {
    currentBlockTime = startTime + collectionLength - 1 // narrator start time
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Rejects bids after the auction ends", async () => {
    currentBlockTime = startTime + collectionLength + baseAuctionDuration
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Accepts only winning bids when the auction is open", async () => {
    currentBlockTime = startTime + collectionLength // story end time
    await expect(bobBid(1, 0, 0, minBidAmount.add(2), currentBlockTime))
      .not.to.be.reverted

    currentBlockTime += 2
    await expect(carolBid(1, 0, 0, minBidAmount.add(1), currentBlockTime))
      .to.be.revertedWith("Bid increment too low")
  })

  it("Stops bids that are too small", async () => {
    currentBlockTime = startTime + collectionLength // auction start

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
      + collectionLength
      + baseAuctionDuration
      - timeBuffer
    // should not extend
    await bobBid(1, 0, 0, minBidAmount, currentBlockTime)
    const storyId = await publisher.getStoryId(1, 0, 0)
    let story = await publisher.stories(storyId)
    expect(story.auction.duration).to.equal(baseAuctionDuration)

    currentBlockTime += 21
    // should extend by 20 (setting block times seems to be off by 1)
    await carolBid(1, 0, 0, minBidAmount.mul(2), currentBlockTime)
    story = await publisher.stories(storyId)
    expect(story.auction.duration).to.equal(baseAuctionDuration + 20)

    // the end of the auction
    currentBlockTime += timeBuffer - 1
    await expect(bobBid(1, 0, 0, minBidAmount.mul(3), currentBlockTime))
      .not.to.be.reverted
    story = await publisher.stories(storyId)
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

  it("Repays bidders when outbid", async () => {
    // move to auction start and make a bid
    currentBlockTime = startTime + collectionLength + 1
    const bobBidAmount = minBidAmount
    await expect(
      bobBid(1, 0, 0, bobBidAmount, currentBlockTime)
    ).to.changeEtherBalances(
      [bob, publisher.address],
      [-minBidAmount, minBidAmount]
    )

    currentBlockTime += 1
    const carolBidAmount = minBidAmount * 2
    await expect(
      carolBid(1, 0, 0, carolBidAmount, currentBlockTime)
    ).to.changeEtherBalances(
      [carol,           bob,          publisher.address],
      [-carolBidAmount, bobBidAmount, carolBidAmount - bobBidAmount],
    )
  })

  it("Pays the contract owner when minting", async () => {
    currentBlockTime = startTime + collectionLength + 1
    const bidAmount = minBidAmount * 3
    const bidTx = await bobBid(1, 0, 0, bidAmount, currentBlockTime)
    await bidTx.wait
    console.log('here')

    currentBlockTime = startTime + collectionLength + baseAuctionDuration + 1
    await expect(
      bobMint(1, 0, 0, currentBlockTime)
    ).to.changeEtherBalances(
      [bob, alice,     publisher.address],
      [0,   bidAmount, -bidAmount],
    )
  })
})
