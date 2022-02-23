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
    ropsten: "The Grand Adventure: Ropstenluutn",
    localhost: "The Local Adventure: Localuutn",
    goerli: "The Goerand Adventure: Govenluutn"
  }
  const symbols = {
    ropsten: "tgaRPSTNLTN",
    localhost: "tlaLCLTN",
    goerli: "tgaGVNLTN"
  }
  const baseURIs = {
    goreli: "https://avenluutn-api.squad.games"
  }
  const name = names[hre.network.name] || "The Grand Adventure: Avenluutn"
  const symbol = symbols[hre.network.name] || "tgaAVNLTN"
  const baseURI = baseURIs[hre.network.name] || "https://avenluutn-api.squad.games"

  const baseAuctionDuration = 60 * 60
  const timeBuffer = 30 * 60
  const minBidAmount = hre.ethers.utils.parseEther('0.001')
  const minBidIncrementPercentage = 5

  // We get the contracts to deploy
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
   * add test narratorNFT. This first narrator will point to a script
   * at localhost for testing purposes
   */

  console.log("Minting test NFT")
  const narratorTx = await narratorNFTs.mint(
    narratorNFTs.address,
    "http://localhost:8000/test/bundle.js",
  )

  console.log("Waiting for mint transaction...")
  await narratorTx.wait()

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  console.log("adding test narrator")
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
    now - 60 * 15 * 3,  // start
    10,               // totalCollections
    60 * 60 * 10,            // collectionLength
    60 * 60 * 15,            // collectionSpacing
    5,                  // collectionSize
  )
  const receipt = await pubTx.wait()
  console.log("New narrator added at index:", Number(receipt.events[0].args.count))

  // don't try to verify if we are on localhost or hardhat networks
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    return
  }

  /*
  console.log("verifying NarratorNFTs...")
  await hre.run("verify:verify", {
    address: narratorNFTs.address
  })
  console.log("Verified NarratorNFTs.")
  */

  console.log("Waiting for 8 block confirmations")
  await publisher.deployTransaction.wait(8)
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
