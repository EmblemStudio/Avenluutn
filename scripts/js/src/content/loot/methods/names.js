"use strict";
// Names: https://etherscan.io/address/0xb9310af43f4763003f42661f6fc098428469adab
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameString = exports.getRandomName = exports.getName = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../../../utils");
const namesAbi = require("../abis/names.json");
const NAMES_ADDR = "0xb9310af43f4763003f42661f6fc098428469adab";
const MIN_ID = 1;
const MAX_ID = 8021;
function makeNames(provider) {
    if (!(provider instanceof ethers_1.providers.BaseProvider)) {
        provider = (0, utils_1.makeProvider)(provider);
    }
    return new ethers_1.Contract(NAMES_ADDR, namesAbi, provider);
}
const namesToOmit = ["Trump", ".eth"];
async function getName(nameId, provider) {
    if (nameId < MIN_ID || nameId > MAX_ID) {
        throw new Error(`nameId must be between ${MIN_ID} and ${MAX_ID}`);
    }
    const names = makeNames(provider);
    const nameArray = await Promise.all([
        names.getPrefix(nameId),
        names.getFirstName(nameId),
        names.getMiddleName(nameId),
        names.getLastName(nameId),
        names.getSuffix(nameId)
    ]);
    let [prefix, firstName, middleName, lastName, suffix] = nameArray;
    for (let i = 0; i < namesToOmit.length; i++) {
        const name = namesToOmit[i];
        const index = nameArray.indexOf(name);
        switch (index) {
            case -1:
                break;
            case 0:
                prefix = await names.getPrefix(nameId + 1);
                break;
            case 1:
                firstName = await names.getFirstName(nameId + 1);
                break;
            case 2:
                middleName = await names.getMiddleName(nameId + 1);
                break;
            case 3:
                lastName = await names.getLastName(nameId + 1);
                break;
            case 4:
                suffix = await names.getSuffix(nameId + 1);
                break;
            default:
                break;
        }
    }
    return {
        id: nameId,
        prefix,
        firstName,
        middleName,
        lastName,
        suffix
    };
}
exports.getName = getName;
async function getRandomName(prng, provider) {
    const nameId = prng.nextInt(MIN_ID, MAX_ID);
    return await getName(nameId, provider);
}
exports.getRandomName = getRandomName;
function nameString(name) {
    let res = "";
    const prefix = name.prefix;
    if (prefix) {
        res += prefix + " ";
    }
    const firstName = name.firstName;
    if (firstName) {
        res += firstName + " ";
    }
    const middleName = name.middleName;
    if (middleName) {
        res += middleName + " ";
    }
    const lastName = name.lastName;
    if (lastName) {
        res += lastName;
    }
    const suffix = name.suffix;
    if (suffix) {
        res += " " + suffix;
    }
    return res;
}
exports.nameString = nameString;
