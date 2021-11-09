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

  console.log(hre.network)

  // We get the contracts to deploy
  const NarratorNFTs = await hre.ethers.getContractFactory("NarratorNFTs");
  const narratorNFTs = await NarratorNFTs.deploy()
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

  console.log("Publisher deployed to:", publisher.address);
  fs.writeFileSync('PublisherAddress.txt', publisher.address)
  console.log("NarratorNFTs deployed to:", narratorNFTs.address);
  fs.writeFileSync('NarratorNFTsAddress.txt', narratorNFTs.address)

  /**
   * add test narratorNFT
   */
  const narratorTx = await narratorNFTs.mint(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "data:text/javascript;base64,ZnVuY3Rpb24gdGVsbFN0b3J5KHN0YXRlLCBhLCBiLCBjLCBkKSB7CiAgICBpZiAoIXN0YXRlLmhvd1dlV2VyZSkgewogICAgICAgIHN0YXRlLmhvd1dlV2VyZSA9ICJjdXJpb3VzIgogICAgfQogICAgcmV0dXJuIHsKICAgICAgICBuZXh0U3RhdGU6IE9iamVjdC5hc3NpZ24oc3RhdGUsIHthOiBhfSksCiAgICAgICAgc3RvcmllczogW2BXZSB3ZXJlICR7c3RhdGUuaG93V2VXZXJlfS5gXQogIH0KfQ=="
  )

  // add test narrator
  let pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
    1,
    10,
    100,
    1000,
    10000,
  )
  await narratorTx.wait()
  await pubTx.wait()

  const now = parseInt((new Date().getTime() / 1000).toFixed(0))
  pubTx = await publisher.addNarrator(
    narratorNFTs.address,
    0,
    now, // start
    100,           // totalCollections
    60 * 60 * 12,  // collectionLength
    60 * 60 * 15,  // collectionSpacing
    3,             // collectionSize
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
