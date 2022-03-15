import { useParams } from 'react-router-dom'

import { Story, Narrator, StoryCategory, storyIdFromIndices, storyCategory } from "../utils";
import { NARRATOR_PARAMS } from "../constants"

interface UseStoryResult {
  story: Story | null,
  category: StoryCategory
}

const emptyRes: UseStoryResult = { story: null, category: StoryCategory.unknown }

export default (narrator: Narrator): UseStoryResult => {
  const { guildId, collectionId } = useParams()
  if (guildId === undefined || collectionId === undefined) return emptyRes
  const story: Story = narrator.stories[
    storyIdFromIndices(NARRATOR_PARAMS.narratorIndex, parseInt(guildId), parseInt(collectionId))
  ]
  if (story === undefined) return emptyRes
  const category: StoryCategory = storyCategory(narrator, story)

  return { story, category }
}