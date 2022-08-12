const fs = require('fs')
const {
  firstStartTime,
  storySpacing,
  narrator,
  storeDir
} = require('./config.js')

function storyStartTime(storyIndex) {
  return firstStartTime + (storySpacing * storyIndex)
}

function fileNameFromStoryIndex(storyIndex) {
  return `${storeDir}/${narrator}.${storyIndex}.json`
}

function storyIndexFromFilename(filename) {
  const regexp = new RegExp(`${narrator}\\.\\d+\\.json`)
  const matches = filename.match(regexp)
  if (matches === null) {
    return -1
  }
  if (matches.length !== 1) {
    return -1
  }

  const storyIndex = parseInt(
    matches[0]
      .replace('.json', '')
      .replace(`${narrator}.`, ''),
    10)
  return storyIndex
}

function latestStoryIndex() {
  let latestStoryIndex = -1
  const files = fs.readdirSync(storeDir)
  files.forEach((f) => {
    latestStoryIndex = Math.max(
      latestStoryIndex,
      storyIndexFromFilename(f),
    )
  })
  return latestStoryIndex
}

function resultOfStoryIndex(storyIndex) {
  if (storyIndex < 0) {
    return null
  }
  return fs.readFileSync(fileNameFromStoryIndex(storyIndex)).toString()
}

function nextArgs() {
  let i = latestStoryIndex() // the highest one we've got a file for
  if (i === -1) {
    // if we don't have any so far
    return {
      storyIndex: 0,
      startTime: firstStartTime,
      previousResultJSON: null
    }
  }
  // read the latest file we've got
  const result = fs.readFileSync(fileNameFromStoryIndex(i)).toString()
  if (JSON.parse(result).nextUpdateTime === -1) {
    // if this one is complete. move onto the next one
    i += 1
  }
  return {
    storyIndex: i,
    startTime: storyStartTime(i),
    previousResultJSON: resultOfStoryIndex(i - 1)
  }
}

module.exports = {
  nextArgs,
  fileNameFromStoryIndex
}
