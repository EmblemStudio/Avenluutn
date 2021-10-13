const { expect } = require("chai")
const { ethers, network } = require("hardhat")

const {
  NFTAddress,
  minBidAmount,
  minBidIncrementPercentage,
  start,
  getNarrativeManager,
  setNextBlockTime
}= require('./utils')

describe("NarrativeManager Auctions", () => {
  let narrativeManager
  let bobBid
  let carolBid
  let currentBlockTime = 2000000000000
  let startTime        = 2100000000000
  const totalNarratives = 3
  const narrativeLength = 10
  const baseAuctionDuration = 100
  const timeBuffer = 50
  const narrativeSpacing = 1000
  const copies = 1

  let alice, bob, carol


  function mkBidder(wallet) {
    return async function (
      narratorIndex,
      narrativeIndex,
      copyIndex,
      bidAmount,
      blockTime
    ) {
      await setNextBlockTime(blockTime)
      const walletNarrativeManager = narrativeManager.connect(wallet)
      return walletNarrativeManager.bid(
        narratorIndex,
        narrativeIndex,
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
    narrativeManager = await getNarrativeManager({
      baseAuctionDuration,
      timeBuffer
    })
    const bobNarrativeManager = narrativeManager.connect(bob)
    await setNextBlockTime(currentBlockTime)
    narrativeManager.addNarrator(
      NFTAddress,
      1,
      startTime,
      totalNarratives,
      narrativeLength,
      narrativeSpacing,
      copies
    )
    bobBid = mkBidder(bob)
    carolBid = mkBidder(carol)
  })

  it("Rejects bids before the narrative ends", async () => {
    currentBlockTime = startTime + narrativeLength - 1 // narrator start time
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Rejects bids after the auction ends", async () => {
    currentBlockTime = startTime + narrativeLength + baseAuctionDuration
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Accepts only winning bids when the auction is open", async () => {
    currentBlockTime = startTime + narrativeLength // narrative end time
    await expect(bobBid(1, 0, 0, minBidAmount.add(2), currentBlockTime))
      .not.to.be.reverted

    currentBlockTime += 2
    await expect(carolBid(1, 0, 0, minBidAmount.add(1), currentBlockTime))
      .to.be.revertedWith("Bid increment too low")
  })

  it("Stops bids that are too small", async () => {
    currentBlockTime = startTime + narrativeLength // auction start

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
      + narrativeLength
      + baseAuctionDuration
      - timeBuffer
    // should not extend
    await bobBid(1, 0, 0, minBidAmount, currentBlockTime)
    const narrativeId = await narrativeManager.getNarrativeId(1, 0, 0)
    let narrative = await narrativeManager.narratives(narrativeId)
    expect(narrative.auction.duration).to.equal(baseAuctionDuration)

    currentBlockTime += 21
    // should extend by 20 (setting block times seems to be off by 1)
    await carolBid(1, 0, 0, minBidAmount.mul(2), currentBlockTime)
    narrative = await narrativeManager.narratives(narrativeId)
    expect(narrative.auction.duration).to.equal(baseAuctionDuration + 20)

    // the end of the auction
    currentBlockTime += timeBuffer - 1
    await expect(bobBid(1, 0, 0, minBidAmount.mul(3), currentBlockTime))
      .not.to.be.reverted
    narrative = await narrativeManager.narratives(narrativeId)
    expect(
      narrative.auction.duration
    ).to.equal(
      // add in all previous extensions
      baseAuctionDuration + 20 + timeBuffer - 1
    )

    currentBlockTime += timeBuffer
    await expect(carolBid(1, 0, 0, minBidAmount.mul(4), currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })
})
