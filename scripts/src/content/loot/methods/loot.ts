// Loot: https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7

import { providers, Contract } from 'ethers'
import Prando from 'prando'

import { makeProvider } from '../../../utils'
import * as lootAbi from '../abis/loot.json'

import lootContractStrangler from './lootContractStrangler'

const LOOT_ADDR = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"
const MIN_ID = 1
const MAX_ID = 8000

interface LootBag {
  [key: string]: string | number;
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

function makeLoot(provider?: providers.BaseProvider | string) {
  return lootContractStrangler
//  if (!(provider instanceof providers.BaseProvider)) {
//    provider = makeProvider(provider)
//  }
//  return new Contract(
//    LOOT_ADDR,
//    lootAbi,
//    provider
//  )
}

export async function getLootBag(lootId: number, provider?: providers.BaseProvider | string): Promise<LootBag> {
  if (lootId < MIN_ID || lootId > MAX_ID) {
    throw new Error(`lootId must be between ${MIN_ID} and ${MAX_ID}`)
  }

  const loot = makeLoot(provider)

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

// TODO implement getRandomCommonLootPiece, getRandomRareLootPiece, etc.
export async function getRandomLootPiece(
  prng: Prando,
  provider?: providers.BaseProvider | string
): Promise<string> {
  const lootId = prng.nextInt(MIN_ID, MAX_ID)
  const lootBag = await getLootBag(lootId, provider)
  const lootKey = Object.keys(lootBag)[
    prng.nextInt(1, Object.keys(lootBag).length - 1)
  ]
  if (!lootKey) { throw new Error("No lootKey") }
  const res = lootBag[lootKey]
  if (!res) { throw new Error("No result") }
  if (typeof res === "number") { throw new Error("Found number instead of string") }
  return res
}
