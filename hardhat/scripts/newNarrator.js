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
    "https://gist.githubusercontent.com/EzraWeller/30d5e8eb8fb00a7261c171957ff32c66/raw/f4f2064177ce0d83996f1dd0ccdc1b28324fde4c/avenluutn_bundle_070322.js"
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

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    Number(nftId),
    start, // start
    30,                // totalCollections
    1 * hours,           // collectionLength
    1.1 * hours,           // collectionSpacing
    5,                 // collectionSize
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
