import { Story } from ".";

export function storyId(collectionIndex: number, storyIndex: number): string {
  return `${storyIndex}-${collectionIndex}`
}