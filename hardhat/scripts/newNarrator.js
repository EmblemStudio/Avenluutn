const hre = require("hardhat")
const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("../artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("../artifacts/contracts/Publisher.sol/Publisher.json").abi
const fs = require('fs')

async function main() {
  // We get the publisher and NFT contract
  const signers = await hre.ethers.getSigners()
  const narratorNFTsAddress = fs.readFileSync(`./${hre.network.name}_NarratorNFTsAddress.txt`).toString()
  const publisherAddress = fs.readFileSync(`./${hre.network.name}_PublisherAddress.txt`).toString()
  const narratorNFTs = new Contract(narratorNFTsAddress, nftAbi, signers[0])
  const publisher = new Contract(publisherAddress, publisherAbi, signers[0])

  const nftId = await narratorNFTs.ids()

  console.log("NFT id", Number(nftId))

  /**
   * mint narratorNFT
   */
  /*
  const narratorTx = await narratorNFTs.mint(
    "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // Squad Test
    "https://gist.githubusercontent.com/EzraWeller/4a7468ec46ee6b83ed0b167c24339f4c/raw/04edc8559415d8067c0d3c51abe6d9cc8d9203a3/avenluutn_bundle_090122.js"
  )

  console.log("Waiting for mint tx", narratorTx.hash, narratorTx.nonce)
  await narratorTx.wait()

  console.log("minted NFT")
  */
  const minutes = 60
  const hours = minutes * 60
  const start = 1644534000
  /*
  Unix Timestamp	1644534000
  GMT  Thu Feb 10 2022 23:00:00 GMT+0000
  Your Time Zone	Thu Feb 10 2022 17:00:00 GMT-0600 (Central Standard Time)
  */
        /* Unix Timestamp   1641985200
           GMT	            Wed Jan 12 2022 11:00:00 GMT+0000
           Your Time Zone   Wed Jan 12 2022 05:00:00 GMT-0600 (Central Standard Time)
        */

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  const pubTx = await publisher.addNarrator(
    "0x33A9d7DDB8f76B0c940010643B8774eDb1CB42e6", // narratorNFTs.address,
    26, //Number(nftId),
    start,            // start
    60,               // totalCollections
    11 * hours + 30 * minutes,       // collectionLength
    12 * hours,       // collectionSpacing
    5,                // collectionSize
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
