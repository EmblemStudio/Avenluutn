
const storeDir = './store/runs'

// story schedule
// run indefinitely once every 12 hours starting at start time

const minute = 60
const hour = minute * 60
const storySpacing = hour * 12
const firstStartTime = 1660152375 // Aug 10 2022
const narrator = 1000

const storyLength = hour * 11
const totalStories = 6
const providerUrl = 'localhost:3000'

const consistentErrorThreshold = 10
const backoffConstant = 3500

module.exports = {
  storySpacing,
  firstStartTime,
  storyLength,
  totalStories,
  providerUrl,
  narrator,
  consistentErrorThreshold,
  backoffConstant,
  storeDir
}
