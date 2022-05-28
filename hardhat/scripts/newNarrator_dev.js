const hre = require("hardhat")
const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("../artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("../artifacts/contracts/Publisher.sol/Publisher.json").abi
const fs = require('fs')

async function main() {
  // We get the publisher and NFT contract
  const signers = await hre.ethers.getSigners()
  const narratorNFTsAddress = fs.readFileSync(`./${hre.network.name}_NarratorNFTsAddress.txt`).toString().trim()
  const publisherAddress = fs.readFileSync(`./${hre.network.name}_dev_PublisherAddress.txt`).toString().trim()
  const narratorNFTs = new Contract(narratorNFTsAddress, nftAbi, signers[0])
  const publisher = new Contract(publisherAddress, publisherAbi, signers[0])

  const nftId = await narratorNFTs.ids()
  // console.log("NFT id", Number(nftId))

  /**
   * mint narratorNFT
   */

  const narratorTx = await narratorNFTs.mint(
    "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // Squad Test
    "https://arweave.net/PuRXfkPdGlMYfVLfSCw4yF-14YpnTHlaVVFbuMbb1EY"
  )

  console.log("Waiting for mint tx", narratorTx.hash, narratorTx.nonce)
  await narratorTx.wait()

  console.log("minted NFT")

  const minutes = 60
  const hours = minutes * 60
  const start = 1645963200
  /*
    Unix Timestamp      1645963200
    GMT	                Sun Feb 27 2022 12:00:00 GMT+0000
    Your Time Zone	Sun Feb 27 2022 06:00:00 GMT-0600 (Central Standard Time)
    Relative	        a day ago
  */

  const now = Math.floor(new Date() / 1000)
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    Number(nftId),
    now,  // start
    7,                // totalCollections
    45 * minutes,     // collectionLength
    50 * minutes,     // collectionSpacing
    6,                // collectionSize
  )
  console.log("Waiting for addNarrator tx", pubTx.hash, pubTx.nonce)
  const receipt = await pubTx.wait()
  console.log("New narrator added at index:", Number(receipt.events[0].args.count))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
