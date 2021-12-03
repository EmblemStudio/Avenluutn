const hre = require("hardhat")
const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("../artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("../artifacts/contracts/Publisher.sol/Publisher.json").abi

async function main() {
  // We get the contracts to deploy
  const signers = await hre.ethers.getSigners()
  const narratorNFTs = new Contract("0x2F48fD01C3f03bD8E16481369c88d94c5588B0ae", nftAbi, signers[0]) 
  const publisher = new Contract("0x9Ee5716bd64ec6e90e0a1F44C5eA346Cd0a8E5a4", publisherAbi, signers[0])
  
  const nftId = await narratorNFTs.ids()

  // console.log('nftId', nftId)
  console.log(await publisher.narrators(3))
  console.log(await narratorNFTs.tokenURI(3))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
