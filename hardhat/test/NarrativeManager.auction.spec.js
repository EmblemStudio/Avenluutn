const { expect } = require("chai")
const { ethers, network } = require("hardhat")

const {
  NFTAddress,
  timeBuffer,
  minBidAmount,
  minBidIncrementPercentage,
  start,
  getNarrativeManager,
  setNextBlockTime
}= require('./utils')

describe("NarrativeManager Auctions", () => {
  let narrativeManager
  let bobNarrativeManager
  let currentBlockTime
  let startTime
  const totalNarratives = 2
  const narrativeLength = 3
  const baseAuctionDuration = 40
  const narrativeSpacing = 100
  const copies = 1

  let alice, bob, carol

  beforeEach(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: []
    })
    ;[alice, bob, carol] = await ethers.getSigners()
    narrativeManager = await getNarrativeManager()
    bobNarrativeManager = narrativeManager.connect(bob)
    currentBlockTime = Number(new Date())
    await setNextBlockTime(currentBlockTime)
    startTime = currentBlockTime + 5
    narrativeManager.addNarrator(
      NFTAddress,
      1,
      startTime,
      totalNarratives,
      narrativeLength,
      narrativeSpacing,
      copies
    )
  })

  async function bobBid(narratorIndex, narrativeIndex, copyIndex, bidAmount, blockTime) {
    await setNextBlockTime(blockTime)
    return bobNarrativeManager.bid(
      narratorIndex,
      narrativeIndex,
      copyIndex,
      await bob.getAddress(),
      { value: bidAmount }
    )
  }

  it("Rejects bids before the narrative ends", async () => {
    currentBlockTime = startTime + narrativeLength - 1 // narrator start time
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it.only("Rejects bids after the auction ends", async () => {
    currentBlockTime = startTime + narrativeLength + baseAuctionDuration
    console.log(startTime)
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .to.be.revertedWith("Auction not open")
  })

  it("Accepts winning bids when the auction is open", async () => {
    currentBlockTime = startTime + narrativeLength // narrative end time
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .not.to.be.reverted
  })

  it.skip("Rejects losing bids even when the auction is open", async () => {
    expect(true).to.equal(false)
  })

  it.skip("Stops bids that are too small", async () => {
    // narrator starts in 5
    let i = 0
    currentBlockTime = startTime + narrativeLength // auction start
    await expect(bobBid(1, 0, 0, minBidAmount - 1, currentBlockTime))
      .to.be.revertedWith("Bid below minimum bid amount")

    currentBlockTime += 2
    await expect(bobBid(1, 0, 0, minBidAmount, currentBlockTime))
      .not.to.be.reverted

    currentBlockTime += 2
    await setNextBlockTime(currentBlockTime)
    const minIncrementBid = minBidAmount + (
      minBidAmount * minBidIncrementPercentage / 100
    )
    await expect(bobBid(1, 0, 0, minIncrementBid - 1, currentBlockTime))
      .to.be.revertedWith("Bid increment too low")

    currentBlockTime += 1
    await setNextBlockTime(currentBlockTime)
    await expect(bobBid(1, 0, 0, minIncrementBid, currentBlockTime))
      .not.to.be.reverted
  })

  it.skip("Extends the acution on bids close to the end", async () => {
    expect(true).to.equal(false)
  })
})
