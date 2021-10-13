const { expect } = require("chai")
const { ethers } = require("hardhat")

const {
  NFTAddress,
  NFTId,
  start,
  totalNarratives,
  narrativeLength,
  narrativeSpacing,
  copies,
  getNarrativeManager
}= require('./utils')

describe("NarrativeManager", () => {
  let narrativeManager
  let bobNarrativeManager

  let alice, bob

  beforeEach(async () => {
    ;[alice, bob] = await ethers.getSigners()
    narrativeManager = await getNarrativeManager()
    bobNarrativeManager = narrativeManager.connect(bob)
  })

  it("Should append narrators to its array", async function () {

    const firstNarrator = await narrativeManager.narrators(0)
    expect(firstNarrator.NFTAddress).to.equal(NFTAddress)
    expect(firstNarrator.NFTId).to.equal(ethers.BigNumber.from(NFTId))
    expect(firstNarrator.start).to.equal(ethers.BigNumber.from(start))
    expect(firstNarrator.totalNarratives).to.equal(ethers.BigNumber.from(totalNarratives))
    expect(firstNarrator.narrativeLength).to.equal(ethers.BigNumber.from(narrativeLength))
    expect(firstNarrator.narrativeSpacing).to.equal(ethers.BigNumber.from(narrativeSpacing))
    expect(firstNarrator.copies).to.equal(ethers.BigNumber.from(copies))

    const futureNarrator = await narrativeManager.narrators(1)
    expect(futureNarrator.NFTAddress).to.equal("0x0000000000000000000000000000000000000000")
    expect(futureNarrator.narrativeSpacing).to.equal(ethers.BigNumber.from(0))

    const nextNFTId = 2
    const nextStart = start + 5
    const nextTotalNarratives = totalNarratives + 2
    const nextNarrativeLength = narrativeLength + 15
    const nextNarrativeSpacing = narrativeSpacing + 3
    const nextCopies = copies + 123
    const addNarratorTx = await narrativeManager.addNarrator(
      NFTAddress,
      nextNFTId,
      nextStart,
      nextTotalNarratives,
      nextNarrativeLength,
      nextNarrativeSpacing,
      nextCopies,
    )
    await addNarratorTx.wait()

    const nextNarrator = await narrativeManager.narrators(1)
    expect(nextNarrator.NFTAddress).to.equal(NFTAddress)
    expect(nextNarrator.NFTId).to.equal(ethers.BigNumber.from(nextNFTId))
    expect(nextNarrator.start).to.equal(ethers.BigNumber.from(nextStart))
    expect(nextNarrator.totalNarratives).to.equal(
      ethers.BigNumber.from(nextTotalNarratives)
    )
    expect(nextNarrator.narrativeLength).to.equal(
      ethers.BigNumber.from(nextNarrativeLength)
    )
    expect(nextNarrator.narrativeSpacing).to.equal(
      ethers.BigNumber.from(nextNarrativeSpacing)
    )
    expect(nextNarrator.copies).to.equal(ethers.BigNumber.from(nextCopies))
  })

  it("Reports narrative start times", async () => {
    const cases = [
      // first narrative should be the start time
      [0, 0, 0, start],

      // different copies should start at the same time
      [0, 0, 1, start],

      // second narrative should be start + narrative spacing
      [0, 1, 0, start + narrativeSpacing],

      // different copies should be the same there too
      [0, 1, 1, start + narrativeSpacing],
    ]

    for (const i in cases) {
      const [
        narratorIndex,
        narrativeIndex,
        copyIndex,
        expectedStartTime
      ] = cases[i]
      const startTime = await narrativeManager.narrativeStartTime(
        narratorIndex,
        narrativeIndex,
        copyIndex
      )
      expect(startTime).to.equal(expectedStartTime)
    }

    const revertCases = [
      [1, 0, 0],
      [0, totalNarratives, 0],
      [0, 0, copies]
    ]

    for (const i in revertCases) {
      const [
        narratorIndex,
        narrativeIndex,
        copyIndex
      ] = revertCases[i]
      await expect(narrativeManager.narrativeStartTime(
        narratorIndex,
        narrativeIndex,
        copyIndex
      )).to.be.reverted
    }
  })

  it("Logs NarratorAdded events", async () => {
    await expect(narrativeManager.addNarrator(
      NFTAddress,
      NFTId,
      start,
      totalNarratives,
      narrativeLength,
      narrativeSpacing,
      copies
    )).to.emit(
      narrativeManager, "NarratorAdded"
    ).withArgs(
      [
        NFTAddress,
        NFTId,
        start,
        totalNarratives,
        narrativeLength,
        narrativeSpacing,
        copies
      ],
      1
    )
  })

  it("Disallows non-owners to add narrators", async () => {
    await expect(bobNarrativeManager.addNarrator(
      NFTAddress,
      NFTId,
      start,
      totalNarratives,
      narrativeLength,
      narrativeSpacing,
      copies
    )).to.be.revertedWith("Ownable: caller is not the owner")
  })
})
