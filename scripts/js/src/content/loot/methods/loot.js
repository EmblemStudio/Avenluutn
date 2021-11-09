"use strict";
// Loot: https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomLootPiece = exports.getLootBag = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../../../utils");
const lootAbi = require("../abis/loot.json");
const LOOT_ADDR = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7";
const MIN_ID = 1;
const MAX_ID = 8000;
function makeLoot(provider) {
    if (!(provider instanceof ethers_1.providers.BaseProvider)) {
        provider = (0, utils_1.makeProvider)(provider);
    }
    return new ethers_1.Contract(LOOT_ADDR, lootAbi, provider);
}
async function getLootBag(lootId, provider) {
    if (lootId < MIN_ID || lootId > MAX_ID) {
        throw new Error(`lootId must be between ${MIN_ID} and ${MAX_ID}`);
    }
    const loot = makeLoot(provider);
    const [chest, foot, hand, head, neck, ring, waist, weapon] = await Promise.all([
        loot.getChest(lootId),
        loot.getFoot(lootId),
        loot.getHand(lootId),
        loot.getHead(lootId),
        loot.getNeck(lootId),
        loot.getRing(lootId),
        loot.getWaist(lootId),
        loot.getWeapon(lootId),
    ]);
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
    };
}
exports.getLootBag = getLootBag;
// TODO implement getRandomCommonLootPiece, getRandomRareLootPiece, etc.
async function getRandomLootPiece(prng, provider) {
    const lootId = prng.nextInt(MIN_ID, MAX_ID);
    const lootBag = await getLootBag(lootId, provider);
    const lootKey = Object.keys(lootBag)[prng.nextInt(1, Object.keys(lootBag).length - 1)];
    if (!lootKey) {
        throw new Error("No lootKey");
    }
    const res = lootBag[lootKey];
    if (!res) {
        throw new Error("No result");
    }
    if (typeof res === "number") {
        throw new Error("Found number instead of string");
    }
    return res;
}
exports.getRandomLootPiece = getRandomLootPiece;
