const avenluutn = require("../dist/bundle.js")

const now = Math.floor(Date.now() / 1000)
const length = 1000000

async function tellCollection(
  size,
  previousResult,
  start,
  length,
  totalStories,
  provider,
  stories,
) {
  if (size === 0) {
    return stories
  }

  const result = await avenluutn.tellStories(
    previousResult, start, length, totalStories, provider
  )

  result.stories.forEach(s => {
    stories.push(s.plainText)
  })

  return tellCollection(
    size - 1,
    result,
    start + Math.floor(length) + 100,
    length,
    totalStories,
    provider,
    stories,
  )
}

tellCollection(
  3,
  null,
  now - (length + (length / 2)),
  length,
  1,
  "http://localhost:8545",
  [],
).then(console.log).catch(console.error)
