"use strict";
// AbilityScores: https://etherscan.io/address/0x42a87e04f87a038774fb39c0a61681e7e859937b#code
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbilityScore = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../../../utils");
const abilityScoreAbi = require("../abis/abilityScores.json");
const ABILITY_SCORES_ADDR = "0x42A87e04f87A038774fb39c0A61681e7e859937b";
function makeAbilityScores(providerUrl) {
    const provider = (0, utils_1.makeProvider)(providerUrl);
    return new ethers_1.ethers.Contract(ABILITY_SCORES_ADDR, abilityScoreAbi, provider);
}
async function getAbilityScore(abilityScoreId, providerUrl) {
    if (1 > abilityScoreId || abilityScoreId > 8000) {
        throw new Error("abilityScoreId must be between 0 and 8000");
    }
    const abilityScores = makeAbilityScores(providerUrl);
    const [strength, dexterity, constitution, intelligence, wisdom, charisma] = await Promise.all([
        abilityScores.getStrength(abilityScoreId),
        abilityScores.getDexterity(abilityScoreId),
        abilityScores.getConstitution(abilityScoreId),
        abilityScores.getIntelligence(abilityScoreId),
        abilityScores.getWisdom(abilityScoreId),
        abilityScores.getCharisma(abilityScoreId)
    ]);
    const result = {
        id: abilityScoreId,
        strength: Number(strength.slice(-2)),
        dexterity: Number(dexterity.slice(-2)),
        constitution: Number(constitution.slice(-2)),
        intelligence: Number(intelligence.slice(-2)),
        wisdom: Number(wisdom.slice(-2)),
        charisma: Number(charisma.slice(-2))
    };
    return result;
}
exports.getAbilityScore = getAbilityScore;
