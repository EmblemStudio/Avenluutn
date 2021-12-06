import { Story } from './types'

export function storyName(s: Story): string {
  return `${s.narratorIndex}-${s.storyIndex}-${s.collectionIndex}`
}