import { getLootBag, getAbilityScore, getName } from './loot'

// TODO set up secret management
const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

async function main() {
  console.log(await getLootBag(1, alchemyAPI))

  console.log(await getAbilityScore(5, alchemyAPI))

  console.log(await getName(10, alchemyAPI))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });