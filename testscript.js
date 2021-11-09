function tellStory(
  previousResult,
  collectionStart,
  collectionLength,
  collectionSize,
  provider
) {
  if (previousResult.stories === undefined) {
    console.log(previousResult, "init")
    return {
      stories: [["We were curious."]],
      nextState: null
    }
  }
  var thingsWeWere = [
    "well",
    "sick",
    "absent",
    "exhausted",
    "enlightened",
    "happy as can be",
    "satisfied",
  ]
  if (previousResult.stories[0].length > collectionLength) {
    return previousResult
  }
  let thingIndex = r(
    collectionStart + collectionLength + collectionSize + previousResult.stories[0].length
  )() * 10 % thingsWeWere.length
  let thing = thingsWeWere[Math.floor(thingIndex)]
  previousResult.stories[0].push(`We were ${thing}.`)
  console.log("thing", thing)
  return previousResult
}

function r(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

module.exports = { tellStory, r }
