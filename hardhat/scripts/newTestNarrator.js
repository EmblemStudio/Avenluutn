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

  console.log("NFT id", Number(nftId))

  const scriptURI = "http://webserver/scripts/activeTestScript.js"

  /**
   * mint narratorNFT
   */
  const narratorTx = await narratorNFTs.mint(
    "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // to Squad Test
    scriptURI,
  )

  console.log("Waiting for mint tx", narratorTx.hash, narratorTx.nonce)
  await narratorTx.wait()

  console.log("minted NFT")

  const minute = 60
  const hour = minute * 60
  const now = Math.floor(new Date() / 1000)
  const collectionLength = minute * 10
  const collectionSpacing = minute * 15
  const start = now - (collectionSpacing * 3) // three starting in the past
  const totalCollections = Math.floor((8 * hour) / collectionSpacing) // work day's worth
  const collectionSize = 5

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
  // TODO factor out the timing reporting to a utils lib
  // TODO save this info to a file
  console.log("script URI", scriptURI)
  console.log("total collections", totalCollections)
  console.log("collection Length", collectionLength)
  console.log("collection Spacing", collectionSpacing)
  console.log("collection Size", collectionSize)

  let startTime = start
  // calculate and print run start times to help with debugging
  console.log("Start Times (US Eastern)") // TODO grab the users timezone
  console.log(`Now: ${new Date(now * 1000).toLocaleString('en-US', { timeZone: 'America/New_York'})}`)
  const startTimes = [...Array(totalCollections).keys()].forEach((collection) => {
    const collectionStart = new Date((start + (collection * collectionSpacing)) * 1000)
    console.log(`Collection ${collection}: ${collectionStart.toLocaleString('en-US', { timeZone: 'America/New_York'})}`)
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
