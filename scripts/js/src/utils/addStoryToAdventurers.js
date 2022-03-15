"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStoryToAdventurers = void 0;
function addStoryToAdventurers(party, storyId) {
    party.forEach(adv => {
        adv.stories.push(storyId);
    });
}
exports.addStoryToAdventurers = addStoryToAdventurers;
