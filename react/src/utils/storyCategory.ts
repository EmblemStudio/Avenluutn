import { Narrator, Story, StoryCategory, presentOrPast } from '.'

export function storyCategory(narrator: Narrator, story: Story): StoryCategory {
  const started = presentOrPast(story.startTime)
  const storyEnded = presentOrPast(story.endTime)
  const auctionEnded = presentOrPast(story.endTime.add(story.auction.duration))
  if (!started) {
    return StoryCategory.upcoming
  } else if (started && !storyEnded) {
    // hack
    if (story.text.nextUpdateTime === -1) story.text.nextUpdateTime = Number(story.endTime)
    return StoryCategory.inProgress
  } else if (storyEnded && !auctionEnded) {
    return StoryCategory.onAuction
  } else if (storyEnded && auctionEnded) {
    return StoryCategory.completed
  }
  return StoryCategory.unknown
}