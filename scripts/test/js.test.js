const index = require('../js/src/index')

console.log(index)

index.tellStories(
  null, 
  Math.floor(Date.now()/1000 - 10000), 
  1000, 
  1, 
  "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"
)
  .then(console.log)
