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

  // console.log(hre.network)

  // We get the contracts to deploy
  console.log("deploying NarratorNFTs")
  const NarratorNFTs = await hre.ethers.getContractFactory("NarratorNFTs");
  const narratorNFTs = await NarratorNFTs.deploy()
  console.log("deploying Publisher")
  const Publisher = await hre.ethers.getContractFactory("Publisher");
  const publisher = await Publisher.deploy(
    15 * 60,
    100 * 60,
    hre.ethers.utils.parseEther('0.001'),
    5,
    "TESTavenluutn: the grand adventure",
    "TATGA",
  );

  await narratorNFTs.deployed();
  await publisher.deployed();

  console.log("NarratorNFTs deployed to:", narratorNFTs.address);
  fs.writeFileSync('NarratorNFTsAddress.txt', narratorNFTs.address)
  console.log("Publisher deployed to:", publisher.address);
  fs.writeFileSync('PublisherAddress.txt', publisher.address)

  /**
   * add test narratorNFT
   */
  console.log("Minting test NFT")
  const narratorTx = await narratorNFTs.mint(
    narratorNFTs.address, // "0x9b8d5AF3625d81bb3376916c4D98A20B98b85bCF", // Squad Test
    "http://localhost:8000/test_script.js",
    //"https://gist.githubusercontent.com/jessebmiller/e7b6cab916151b176278d43ccf0946db/raw/4600ba92972119db1a4645e6c64e5e8da5465fea/bundle_2021-12-02.js"
  )

  // add test narrator
  /*
  let pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
    1,
    10,
    100,
    1000,
    10000,
  )
  */
  await narratorTx.wait()
  // await pubTx.wait()

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  console.log("adding test narrator")
  const pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
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
