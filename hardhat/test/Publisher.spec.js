const { expect } = require("chai")
const { ethers } = require("hardhat")

const {
  NFTAddress,
  NFTId,
  start,
  totalCollections,
  collectionLength,
  collectionSpacing,
  collectionSize,
  getPublisher
}= require('./utils')

describe("Publisher", () => {
  let Publisher
  let bobPublisher

  let alice, bob

  beforeEach(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: []
    })
    ;[alice, bob] = await ethers.getSigners()
    Publisher = await getPublisher()
    bobPublisher = Publisher.connect(bob)
  })

  it("Should append narrators to its array", async function () {

    const firstNarrator = await Publisher.narrators(0)
    expect(firstNarrator.NFTAddress).to.equal(NFTAddress)
    expect(firstNarrator.NFTId).to.equal(NFTId)
    expect(firstNarrator.start).to.equal(start)
    expect(firstNarrator.totalCollections).to.equal(totalCollections)
    expect(firstNarrator.collectionLength).to.equal(collectionLength)
    expect(firstNarrator.collectionSpacing).to.equal(collectionSpacing)
    expect(firstNarrator.collectionSize).to.equal(collectionSize)

    const futureNarrator = await Publisher.narrators(1)
    expect(futureNarrator.NFTAddress).to.equal("0x0000000000000000000000000000000000000000")
    expect(futureNarrator.collectionSpacing).to.equal(0)

    const nextNFTId = 2
    const nextStart = start + 5
    const nextTotalCollections = totalCollections + 2
    const nextCollectionLength = collectionLength + 15
    const nextCollectionSpacing = collectionSpacing + 3
    const nextCollectionSize = collectionSize + 123
    const addNarratorTx = await Publisher.addNarrator(
      NFTAddress,
      nextNFTId,
      nextStart,
      nextTotalCollections,
      nextCollectionLength,
      nextCollectionSpacing,
      nextCollectionSize,
    )
    await addNarratorTx.wait()

    const nextNarrator = await Publisher.narrators(1)
    expect(nextNarrator.NFTAddress).to.equal(NFTAddress)
    expect(nextNarrator.NFTId).to.equal(nextNFTId)
    expect(nextNarrator.start).to.equal(nextStart)
    expect(nextNarrator.totalCollections).to.equal(nextTotalCollections)
    expect(nextNarrator.collectionLength).to.equal(nextCollectionLength)
    expect(nextNarrator.collectionSpacing).to.equal(nextCollectionSpacing)
    expect(nextNarrator.collectionSize).to.equal(nextCollectionSize)
  })

  it("Reports collection start times", async () => {
    const cases = [
      // first collection should be the start time
      [0, 0, 0, start],

      // different collectionSize should start at the same time
      [0, 0, 1, start],

      // second collection should be start + collection spacing
      [0, 1, 0, start + collectionSpacing],

      // different collectionSize should be the same there too
      [0, 1, 1, start + collectionSpacing],
    ]

    for (const i in cases) {
      const [
        narratorIndex,
        collectionIndex,
        storyIndex,
        expectedStartTime
      ] = cases[i]
      const startTime = await Publisher.storyStartTime(
        narratorIndex,
        collectionIndex,
        storyIndex
      )
      expect(startTime).to.equal(expectedStartTime)
    }

    const revertCases = [
      [1, 0, 0],
      [0, totalCollections, 0],
      [0, 0, collectionSize]
    ]

    for (const i in revertCases) {
      const [
        narratorIndex,
        collectionIndex,
        storyIndex
      ] = revertCases[i]
      await expect(Publisher.storyStartTime(
        narratorIndex,
        collectionIndex,
        storyIndex
      )).to.be.reverted
    }
  })

  it("Logs NarratorAdded events", async () => {
    await expect(Publisher.addNarrator(
      NFTAddress,
      NFTId,
      start,
      totalCollections,
      collectionLength,
      collectionSpacing,
      collectionSize
    )).to.emit(
      Publisher, "NarratorAdded"
    ).withArgs(
      [
        NFTAddress,
        NFTId,
        start,
        totalCollections,
        collectionLength,
        collectionSpacing,
        collectionSize
      ],
      1
    )
  })

  it("Disallows non-owners to add narrators", async () => {
    await expect(bobPublisher.addNarrator(
      NFTAddress,
      NFTId,
      start,
      totalCollections,
      collectionLength,
      collectionSpacing,
      collectionSize
    )).to.be.revertedWith("Ownable: caller is not the owner")
  })
})
