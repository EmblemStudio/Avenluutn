const fs = require('fs')
const { tellStories } = require('../scripts/js/src/index.js')
const { nextArgs, fileNameFromStoryIndex } = require('./utils.js')
const {
  storyLength,
  totalStories,
  consistentErrorThreshold,
  backoffConstant
} = require('./config.js')

function save(result, resultFilePath) {
  console.log(`Saving run result to ${resultFilePath}`)
  fs.writeFileSync(resultFilePath, JSON.stringify(result))
}

// on startup we want to run all past stories
// then run stories in progress at their next update time

let done = false;
function main(errorCount) {

  const { storyIndex, startTime, previousResultJSON } = nextArgs()
  tellStories(
    JSON.parse(previousResultJSON),
    startTime,
    storyLength,
    totalStories,
    "localhost:3000"
  ).then((result => {
    save(result, fileNameFromStoryIndex(storyIndex))
    let untilNextRun = 10000 // ten seconds
    if (result.nextUpdateTime > 0) {
      untilNextRun = (result.nextUpdateTime * 1000) - Date.now()
    }
    console.log({untilNextRun})

    setTimeout(
      () => {
        main(Math.floor(errorCount / 2))
      },
      untilNextRun
    )
  })).catch(e => {
    if (errorCount >= consistentErrorThreshold) {
      throw e
    }
    setTimeout(
      () => {
        main(errorCount + 1)
      },
      errorCount * backoffConstant)
  })
}

main(0)
