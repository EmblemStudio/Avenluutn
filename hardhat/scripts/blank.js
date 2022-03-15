const hre = require("hardhat")
const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("../artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("../artifacts/contracts/Publisher.sol/Publisher.json").abi
const fs = require('fs')

async function main() {
  // We get the contracts to deploy
  const signers = await hre.ethers.getSigners()
  const publisherAddress = fs.readFileSync(`./${hre.network.name}_PublisherAddress.txt`).toString()
  const publisher = new Contract(publisherAddress, publisherAbi, signers[0])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
