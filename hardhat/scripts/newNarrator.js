const hre = require("hardhat")
const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("../artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("../artifacts/contracts/Publisher.sol/Publisher.json").abi
const fs = require('fs')

async function main() {
  // We get the publisher and NFT contract
  const signers = await hre.ethers.getSigners()
  const narratorNFTsAddress = fs.readFileSync(`./${hre.network.name}_NarratorNFTsAddress.txt`).toString().trim()
  const publisherAddress = fs.readFileSync(`./${hre.network.name}_PublisherAddress.txt`).toString().trim()
  const narratorNFTs = new Contract(narratorNFTsAddress, nftAbi, signers[0])
  const publisher = new Contract(publisherAddress, publisherAbi, signers[0])

  const nftId = await narratorNFTs.ids()
  // console.log("NFT id", Number(nftId))

  /**
   * mint narratorNFT
   */

  const narratorTx = await narratorNFTs.mint(
    "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // Squad Test
    "https://arweave.net/GpRqQuO6KqFx8warqbErKAMh670dZjkIOnL9rQ2drUQ"
  )

  console.log("Waiting for mint tx", narratorTx.hash, narratorTx.nonce)
  console.log('tx', narratorTx)
  await narratorTx.wait()

  console.log("minted NFT")

  const minutes = 60
  const hours = minutes * 60
  const start = 1652233995
  const totalCollections = 15
  const collectionLength = 36 * hours
  const collectionSpacing = 24 * 4 * hours
  const collectionSize = 6
  /*
Unix Timestamp	1652233995
GMT	Wed May 11 2022 01:53:15 GMT+0000
Your Time Zone	Tue May 10 2022 21:53:15 GMT-0400 (Eastern Daylight Time)
Relative	a month ago
  */

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    Number(nftId),
    start,
    totalCollections,
    collectionLength,
    collectionSpacing,
    collectionSize,
  )
  console.log("Waiting for addNarrator tx", pubTx.hash, pubTx.nonce)
  const receipt = await pubTx.wait()
  console.log("New narrator added at index:", Number(receipt.events[0].args.count))

  let startTime = start
  // calculate and print run start times to help with debugging
  console.log(`Collection Length ${collectionLength}`)
  console.log(`Collection Spacing ${collectionSpacing}`)
  console.log("Start Times (US Eastern, Epoch Timestamp)")
  console.log(`Now: ${new Date(now * 1000).toLocaleString('en-US', { timeZone: 'America/New_York' })}, ${now}`)
  let startTimes = [...Array(totalCollections).keys()].forEach((collection) => {
    const startEpoch = start + (collection * collectionSpacing)
    const endEpoch = startEpoch + collectionLength
    const startEDT = (new Date(startEpoch * 1000)).toLocaleString(
      'en-US',
      { timeZone: 'America/New_York' },
    )
    const endEDT = (new Date(endEpoch * 1000)).toLocaleString(
      'en-US',
      { timeZone: 'America/New_York' },
    )
    console.log(`Collection ${collection}: ${startEDT} - ${endEDT}, ${startEpoch} - ${endEpoch}`)
    collection += 1
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
