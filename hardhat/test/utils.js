const { ethers } = require("hardhat")

const timeBuffer = 15 * 60 // 15 minutes
const baseAuctionDuration = 24 * 60 * 60 * 60 // 24 hours
const minBidAmount = ethers.utils.parseEther("0.001")
const minBidIncrementPercentage = 5
const name = "TestAdventures"
const symbol = "TA"

const NFTAddress = "0x28a8746e75304c0780E011BEd21C72cD78cd535E"
const NFTId = 0
const start = 1
const totalCollections = 3
const collectionLength = 10
const collectionSpacing = 11
const collectionSize = 4

async function getPublisher(overrides) {
  const defaults = {
    timeBuffer,
    baseAuctionDuration,
    minBidAmount,
    minBidIncrementPercentage,
    name,
    symbol
  }
  const params = Object.assign({}, defaults, overrides)
  const Publisher = await ethers.getContractFactory("Publisher");
  const publisher = await Publisher.deploy(
    params.timeBuffer,
    params.baseAuctionDuration,
    params.minBidAmount,
    params.minBidIncrementPercentage,
    params.name,
    params.symbol,
  );

  await publisher.deployed();
  publisher.addNarrator(
    NFTAddress,
    NFTId,
    start,
    totalCollections,
    collectionLength,
    collectionSpacing,
    collectionSize,
  )

  return publisher
}

async function setNextBlockTime(t, mine=false) {
  // TODO investigate why setNextBlockTimestamp is off by one
  await network.provider.send("evm_setNextBlockTimestamp", [t-1])
  if (mine) await network.provider.send("evm_mine")
}

module.exports = {
  timeBuffer,
  baseAuctionDuration,
  minBidAmount,
  minBidIncrementPercentage,
  name,
  symbol,
  NFTAddress,
  NFTId,
  start,
  totalCollections,
  collectionLength,
  collectionSpacing,
  collectionSize,
  getPublisher,
  setNextBlockTime,
}
