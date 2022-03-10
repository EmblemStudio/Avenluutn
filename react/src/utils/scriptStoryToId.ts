import { Narrator, storyId } from ".";
import { StoryId } from "../../../scripts/src";

export function scriptStoryToId(scriptStoryId: StoryId, narrator: Narrator): string {
  const [startTime, storyIndex] = scriptStoryId
  const collectionIndex = Math.floor((startTime - narrator.start.toNumber()) / narrator.collectionSpacing.toNumber())
  return storyId(collectionIndex, storyIndex)
}