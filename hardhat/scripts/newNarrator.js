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

  /**
   * mint narratorNFT
   */
  const narratorTx = await narratorNFTs.mint(
    "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // Squad Test
    "https://gist.githubusercontent.com/jessebmiller/e7b6cab916151b176278d43ccf0946db/raw/4600ba92972119db1a4645e6c64e5e8da5465fea/bundle_2021-12-02.js"
  )
  await narratorTx.wait()

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    nftId,
    now,              // start
    100,              // totalCollections
    60 * 60,          // collectionLength
    60 * 60 * 3 / 2,  // collectionSpacing
    5,                // collectionSize
  )
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
