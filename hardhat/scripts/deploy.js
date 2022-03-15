// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs')


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const names = {
    ropsten: "The Grand Adventure: Avenluutn (ropsten)",
    localhost: "The Grand Adventure: Avenluutn (localhost)",
    goerli: "The Grand Adventure: Avenluutn (goerli)",
    polygon: "The Grand Adventure: Avenluutn",
    mumbai: "The Grand Adventure: Avenluutn (mumbai)"
  }
  const baseURIs = {
    goreli: "https://avenluutn-api.squad.games",
    mumbai: "https://avenluutn-api.squad.games"
  }
  const name = names[hre.network.name] || "The Grand Adventure: Avenluutn"
  const baseURI = baseURIs[hre.network.name] || "https://avenluutn-api.squad.games"
  const symbol = "tgaAVNLTN"

  const minute = 60
  const hour = minute * 60

  const baseAuctionDuration = 24 * hour
  const timeBuffer = 8 * hour
  const minBidAmount = hre.ethers.utils.parseEther('0.001')
  const minBidIncrementPercentage = 5

  console.log("Deploying NarratorNFTs")
  const NarratorNFTs = await hre.ethers.getContractFactory("NarratorNFTs");
  const narratorNFTs = await NarratorNFTs.deploy()
  console.log("Waiting for narratorNFTs to be deployed...")
  await narratorNFTs.deployed();
  console.log(
    `NarratorNFTs deployed to ${hre.network.name} at ${narratorNFTs.address}`
  )
  fs.writeFileSync(
    `${hre.network.name}_NarratorNFTsAddress.txt`,
    narratorNFTs.address,
  )

  console.log("Deploying Publisher")
  const Publisher = await hre.ethers.getContractFactory("Publisher");
  const publisher = await Publisher.deploy(
    baseAuctionDuration,
    timeBuffer,
    minBidAmount,
    minBidIncrementPercentage,
    baseURI,
    name,
    symbol,
  );
  console.log("Waiting for publisher to be deployed...")
  await publisher.deployed();
  console.log(
    `Publisher deployed to ${hre.network.name} at ${publisher.address}`,
  );
  fs.writeFileSync(
    `${hre.network.name}_PublisherAddress.txt`,
    publisher.address,
  )

  /**
   * add test narratorNFT.
   */

  const now = Math.floor(new Date() / 1000)
  const collectionLength = 23 * hour
  const collectionSpacing = 24 * hour
  /*
    Unix Timestamp	1647378000
    GMT         	Tue Mar 15 2022 21:00:00 GMT+0000
    Your Time Zone	Tue Mar 15 2022 16:00:00 GMT-0500 (Central Daylight Time)
*/
  const start = 1647378000
  const totalCollections = 7
  const collectionSize = 5

  console.log("Minting test NFT")
  const scriptURI =  "https://gist.githubusercontent.com/EzraWeller/2ddf2897dec0e2c6529e0cd26bff5145/raw/5d9f7612734a7ad1268262d6e0e73ade6e4d8b22/avenluutn_bundle_130322-2.js"
  const narratorTx = await narratorNFTs.mint(narratorNFTs.address, scriptURI)

  console.log("Waiting for mint transaction...")
  await narratorTx.wait()

  console.log("adding test narrator")
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
    start,
    totalCollections,
    collectionLength,
    collectionSpacing,
    collectionSize,
  )
  const receipt = await pubTx.wait()
  console.log(
    "New narrator added at index:",
    Number(receipt.events[0].args.count),
  )
  console.log("script URI", scriptURI)
  console.log("total collections", totalCollections)
  console.log("collection Length", collectionLength)
  console.log("collection Spacing", collectionSpacing)
  console.log("collection Size", collectionSize)

  let startTime = start
  // calculate and print run start times to help with debugging
  console.log("Start Times (US Eastern)")
  console.log(`Now: ${new Date(now * 1000).toLocaleString('en-US', { timeZone: 'America/New_York'})}`)
  const startTimes = [...Array(totalCollections).keys()].forEach((collection) => {
    const collectionStart = new Date((start + (collection * collectionSpacing)) * 1000)
    console.log(`Collection ${collection}: ${collectionStart.toLocaleString('en-US', { timeZone: 'America/New_York'})}`)
    collection += 1
  })

  // don't try to verify if we are on localhost or hardhat networks
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    return
  }

  console.log("Waiting for 8 block confirmations")
  await publisher.deployTransaction.wait(8)

  console.log("verifying NarratorNFTs...")
  await hre.run("verify:verify", {
    address: narratorNFTs.address
  })
  console.log("Verified NarratorNFTs.")

  console.log("Verifying Publisher...")
  await hre.run("verify:verify", {
    address: publisher.address,
    constructorArguments: [
      baseAuctionDuration,
      timeBuffer,
      minBidAmount,
      minBidIncrementPercentage,
      baseURI,
      name,
      symbol,
    ]
  })
  console.log("Verified Publisher.")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
