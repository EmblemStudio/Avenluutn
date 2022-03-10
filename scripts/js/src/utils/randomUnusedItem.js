"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUnusedItem = void 0;
function randomUnusedItem(used, randomItem) {
    let item = randomItem();
    while (used.includes(item)) {
        item = randomItem();
    }
    return item;
}
exports.randomUnusedItem = randomUnusedItem;
