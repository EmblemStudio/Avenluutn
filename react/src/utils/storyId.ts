import { Story } from './types'

export function storyId(s: Story): string {
  return `${s.narratorIndex}-${s.storyIndex}-${s.collectionIndex}`
}

export function storyIdFromIndices(narratorIndex: number, storyIndex: number, collectionIndex: number): string {
  return `${narratorIndex}-${storyIndex}-${collectionIndex}`
}