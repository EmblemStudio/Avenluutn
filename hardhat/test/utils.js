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
const totalNarratives = 3
const narrativeLength = 10
const narrativeSpacing = 11
const copies = 4

async function getNarrativeManager(overrides) {
  const defaults = {
    timeBuffer,
    baseAuctionDuration,
    minBidAmount,
    minBidIncrementPercentage,
    name,
    symbol
  }
  const params = Object.assign({}, defaults, overrides)
  const NarrativeManager = await ethers.getContractFactory("NarrativeManager");
  const narrativeManager = await NarrativeManager.deploy(
    params.timeBuffer,
    params.baseAuctionDuration,
    params.minBidAmount,
    params.minBidIncrementPercentage,
    params.name,
    params.symbol,
  );

  await narrativeManager.deployed();
  narrativeManager.addNarrator(
    NFTAddress,
    NFTId,
    start,
    totalNarratives,
    narrativeLength,
    narrativeSpacing,
    copies,
  )

  return narrativeManager
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
  totalNarratives,
  narrativeLength,
  narrativeSpacing,
  copies,
  getNarrativeManager,
  setNextBlockTime,
}
