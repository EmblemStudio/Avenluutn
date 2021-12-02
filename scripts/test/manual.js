const avenluutn = require("../dist/bundle.js")

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
    start + Math.floor(length * 1.5),
    length,
    totalStories,
    provider,
    stories,
  )
}

tellCollection(
  3,
  null,
  1637168603,
  400,
  2,
  "http://localhost:8545",
  [],
).then(a => {
  console.log(a)
}).catch(console.error)
