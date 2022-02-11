require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const Contract = require("@ethersproject/contracts").Contract
const nftAbi = require("./artifacts/contracts/NarratorNFTs.sol/NarratorNFTs.json").abi
const publisherAbi = require("./artifacts/contracts/Publisher.sol/Publisher.json").abi
const fs = require('fs')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("updateBaseURI", "Updates the publisher baseURI")
  .addPositionalParam("uri")
  .setAction(async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners()
    const publisherAddress = fs.readFileSync(`./${hre.network.name}_PublisherAddress.txt`).toString()
    const publisher = new Contract(publisherAddress, publisherAbi, signers[0])

    console.log("updating publisher baseURI to", taskArgs.uri)
    await publisher.updateBaseURI(taskArgs.uri)
    console.log("complete")
  })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.

//      mining: {
//        auto: false,
//        interval: [7000, 20000]
//      },
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/0eSItDYUvCynMedxcGDQvPi-Hg7Q2WXk",
        blockNumber: 13678111
      }

    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    goerli: {
      url: process.env.GOERLI_URL || "https://goerli.infura.io/v3/46801402492348e480a7e18d9830eab8",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: "E1PQVBZMFEPQMRZUTJQT24T9NJNXYHXV8U"
  }
};
