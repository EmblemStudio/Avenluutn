const hre = require("hardhat");

async function main() {
  const name = "The Grand Adventure: Avenluutn"
  const baseURI = "https://avenluutn-api.squad.games"
  const symbol = "tgaAVNLTN"

  const minute = 60
  const hour = minute * 60

  const baseAuctionDuration = 24 * hour
  const timeBuffer = 8 * hour
  const minBidAmount = hre.ethers.utils.parseEther('1')
  const minBidIncrementPercentage = 5

  await hre.run("verify:verify", {
    address: "0x33A9d7DDB8f76B0c940010643B8774eDb1CB42e6"
  })
  console.log("verified")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
