import { Adventurer, StoryId } from '.'

export function addStoryToAdventurers(party: Adventurer[], storyId: StoryId) {
  party.forEach(adv => {
    adv.stories.push(storyId)
  })
}