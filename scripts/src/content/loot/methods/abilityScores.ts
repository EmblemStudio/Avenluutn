// AbilityScores: https://etherscan.io/address/0x42a87e04f87a038774fb39c0a61681e7e859937b#code

import { ethers } from 'ethers'

import { makeProvider } from '../../../utils'
import * as abilityScoreAbi from '../abis/abilityScores.json'

const ABILITY_SCORES_ADDR = "0x42A87e04f87A038774fb39c0A61681e7e859937b"

interface AbilityScore {
  id: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

function makeAbilityScores(providerUrl?: string): ethers.Contract {
  const provider = makeProvider(providerUrl)
  return new ethers.Contract(
    ABILITY_SCORES_ADDR,
    abilityScoreAbi,
    provider
  )
}

export async function getAbilityScore(
  abilityScoreId: number, 
  providerUrl?: string
): Promise<AbilityScore> {
  if (1 > abilityScoreId || abilityScoreId > 8000) { 
    throw new Error("abilityScoreId must be between 0 and 8000") 
  }

  const abilityScores = makeAbilityScores(providerUrl)

  const [strength, dexterity, constitution, intelligence, wisdom, charisma] =
    await Promise.all([
      abilityScores.getStrength(abilityScoreId),
      abilityScores.getDexterity(abilityScoreId),
      abilityScores.getConstitution(abilityScoreId),
      abilityScores.getIntelligence(abilityScoreId),
      abilityScores.getWisdom(abilityScoreId),
      abilityScores.getCharisma(abilityScoreId)
    ])

  const result: AbilityScore = {
    id: abilityScoreId,
    strength: Number(strength.slice(-2)),
    dexterity: Number(dexterity.slice(-2)),
    constitution: Number(constitution.slice(-2)),
    intelligence: Number(intelligence.slice(-2)),
    wisdom: Number(wisdom.slice(-2)),
    charisma: Number(charisma.slice(-2))
  }

  return result
}