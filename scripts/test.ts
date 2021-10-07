import { getLootBag, getAbilityScore, getName, getClassInstance } from './src/loot'
import { findBlockHashNear } from './src/utils'
import { prng } from './src/index'

// TODO set up secret management
const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

async function main() {
  console.log(await getLootBag(1, alchemyAPI))
  console.log(await getAbilityScore(5, alchemyAPI))
  console.log(await getName(10, alchemyAPI))
  console.log(await getClassInstance(1000, alchemyAPI))

  console.log(prng.next())
  console.log(prng.next(0, 10))
  console.log(prng.nextInt(10, 100000))

  console.log(await findBlockHashNear(
    Math.floor(Date.now() / 1000) - 100, 
    alchemyAPI
  ))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });