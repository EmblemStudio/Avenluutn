// Loot: https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7

/**
 * Two approaches to grabbing NFT data:
 * 1. identify NFT contract as SVG type
 *    - use `tokenURI` and get an array of strings out of the SVGs text fields
 *    - assign a specific type and convert the array of strings to it
 * 2. for each loot NFT, manually call each of its `getX` functions for each token URI
 * 
 * we should do the second one for now probably
 * 
 * Loot contracts to interact with:
 * - AbilityScores: https://etherscan.io/address/0x42a87e04f87a038774fb39c0a61681e7e859937b#code
 * - Names: https://opensea.io/collection/name-for-adventurers
 * - Class (gender, race, class) https://opensea.io/collection/loot-class
 *   - drawback: binary genders
 * - Treasure https://opensea.io/collection/treasure-for-loot
 * - Realms https://opensea.io/collection/lootrealms
 * - Foes https://opensea.io/collection/foes
 * - Monsters https://opensea.io/collection/lootmonsters
 * 
 * general approach to expand: https://github.com/0x84A/loot.js/tree/main/src
 * 
 */

import { ethers } from 'ethers'

import { makeProvider } from '../utils'
import * as lootAbi from '../abis/loot.json'

const LOOT_ADDR = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"

interface LootBag {
  id: number;
  chest: string;
  foot: string;
  hand: string;
  head: string;
  neck: string;
  ring: string;
  waist: string;
  weapon: string;
}

function makeLoot(providerUrl?: string): ethers.Contract {
  const provider = makeProvider(providerUrl)
  return new ethers.Contract(
    LOOT_ADDR,
    lootAbi,
    provider
  )
}

export async function getLootBag(lootId: number, providerUrl?: string): Promise<LootBag> {
  if (1 > lootId || lootId > 8000) { throw new Error("lootId must be between 1 and 8000") }

  const loot = makeLoot(providerUrl)

  const [chest, foot, hand, head, neck, ring, waist, weapon] =
    await Promise.all([
      loot.getChest(lootId),
      loot.getFoot(lootId),
      loot.getHand(lootId),
      loot.getHead(lootId),
      loot.getNeck(lootId),
      loot.getRing(lootId),
      loot.getWaist(lootId),
      loot.getWeapon(lootId),
    ])

  return {
    id: lootId,
    chest,
    foot,
    hand,
    head,
    neck,
    ring,
    waist,
    weapon,
  }
}

