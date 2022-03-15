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

  const name = "The Grand Adventure: Avenluutn"
  const symbol = "tgaAVNLTN"
  const baseURI = "https://avenluutn-api.squad.games"

  const minute = 60
  const hour = minute * 60
  const baseAuctionDuration = hour
  const timeBuffer = 30 * minute
  const minBidAmount = hre.ethers.utils.parseEther('0.001')
  const minBidIncrementPercentage = 5

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
    `Dev publisher deployed to ${hre.network.name} at ${publisher.address}`,
  );
  fs.writeFileSync(
    `${hre.network.name}_dev_PublisherAddress.txt`,
    publisher.address,
  )

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
