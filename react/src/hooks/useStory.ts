import { useParams } from 'react-router-dom'
import { Story, Narrator, StoryCategory, storyId, storyCategory } from "../utils";

interface UseStoryResult {
  story: Story | null,
  category: StoryCategory
}

const emptyRes: UseStoryResult = { story: null, category: StoryCategory.unknown }

export default (narrator: Narrator): UseStoryResult => {
  const { guildId, collectionId } = useParams()
  if (guildId === undefined || collectionId === undefined) return emptyRes
  const story: Story = narrator.stories[storyId(parseInt(collectionId), parseInt(guildId))]
  if (story === undefined) return emptyRes
  const category: StoryCategory = storyCategory(narrator, story)

  return { story, category }
}