"use strict";
// Class: https://etherscan.io/address/0xccab950f5b192603a94a26c4fa00c8d2d392b98d
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomClass = exports.getClassInstance = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../../../utils");
const classAbi = require("../abis/class.json");
const CLASS_ADDR = "0xccab950f5b192603a94a26c4fa00c8d2d392b98d";
const MIN_ID = 1;
const MAX_ID = 10000;
function makeClass(provider) {
    if (!(provider instanceof ethers_1.providers.BaseProvider)) {
        provider = (0, utils_1.makeProvider)(provider);
    }
    return new ethers_1.Contract(CLASS_ADDR, classAbi, provider);
}
async function getClassInstance(classId, provider) {
    if (classId < MIN_ID || classId > MAX_ID) {
        throw new Error(`classId must be between ${MIN_ID} and ${MAX_ID}`);
    }
    const class_ = makeClass(provider);
    const [gender, race, _class] = await Promise.all([
        class_.getGender(classId),
        class_.getRace(classId),
        class_.getClass(classId),
    ]);
    return {
        id: classId,
        gender: gender.split(": ")[1],
        race: race.split(": ")[1],
        class: _class.split(": ")[1]
    };
}
exports.getClassInstance = getClassInstance;
async function getRandomClass(prng, provider) {
    const classId = prng.nextInt(MIN_ID, MAX_ID);
    return await getClassInstance(classId, provider);
}
exports.getRandomClass = getRandomClass;
