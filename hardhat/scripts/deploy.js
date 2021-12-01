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
    "data:text/javascript;base64,YXN5bmMgZnVuY3Rpb24gdGVsbFN0b3JpZXMocmVzdWx0LCBhLCBiLCBjLCBkKSB7CiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7CiAgICAgICAgbGV0IHN0YXRlID0geyBob3dXZVdlcmU6ICAiY3VyaW91cyJ9CiAgICAgICAgcmVzdWx0ID0geyBuZXh0U3RhdGU6IHN0YXRlLCBzdG9yaWVzOiBbXSB9CiAgICB9CiAgICByZXR1cm4gewogICAgICAgIG5leHRTdGF0ZTogT2JqZWN0LmFzc2lnbihyZXN1bHQubmV4dFN0YXRlLCB7YTogYX0pLAogICAgICAgIHN0b3JpZXM6IFtgV2Ugd2VyZSAke3Jlc3VsdC5uZXh0U3RhdGUuaG93V2VXZXJlfS5gXQogIH0KfQoKbW9kdWxlLmV4cG9ydHMgPSB7IHRlbGxTdG9yaWVzIH0="
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
