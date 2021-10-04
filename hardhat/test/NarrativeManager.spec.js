const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NarrativeManager", function () {
  let narrativeManager
  let initialNarrator

  beforeAll(async () => {
    initialNarrator = {
      NFTAddress: "0xMockNarratorNFTAddress",
      NFTId: 0,
      start: 1,
      totalNarratives: 3,
      narrativeLength: 10,
      narrativeSpacing: 11,
      copies: 4
    }
    const NarrativeManager = await ethers.getContractFactory("NarrativeManager");
    narrativeManager = await NarrativeManager.deploy(
      JSON.stringify(initialNarrator)
    );
    await narrativeManager.deployed();

  })

  it("Should append narrators to its array", async function () {

    expect(await narrativeManager.narrators(0)).to.equal(initialNarrator);

    const nextNarrator = JSON.stringify({
      NFTAddress: "0xNextMockNarratorNFTAddress",
      NFTId: 1,
      start: 2,
      totalNarratives: 4,
      narrativeLength: 12,
      narrativeSpacing: 13,
      copies: 5
    })
    const addNarratorTx = await narrativeManager.addNarrator(nextNarrator)

    await addNarratorTx.wait()

    expect(narrativeManager.narrators(1)).to.equal(nextNarrator)
  })
})
