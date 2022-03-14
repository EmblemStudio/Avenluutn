
import { User, Narrator, storyCategory, storyIdFromIndices, StoryCategory } from '.'
import { SHARE_PAYOUTS, NARRATOR_PARAMS } from '../constants'

export function updateUserFromNarrator(user: User, narrator: Narrator, setUser: (value: User) => void) {
  const newUser = Object.assign({}, user)
  for (const shareId in user.shares) {
    const share = user.shares[shareId]
    const story = narrator.stories[
      storyIdFromIndices(NARRATOR_PARAMS.narratorIndex, share?.storyIndex, share?.collectionIndex)
    ]
    if (story !== undefined) {
      const category = storyCategory(narrator, story)
      if (
        (category === StoryCategory.onAuction || category === StoryCategory.completed) &&
        (newUser.shares[shareId].resolved === false || newUser.shares[shareId].resolved === undefined)
      ) {
        newUser.shares[shareId].outcome = story.text.finalOutcome
        newUser.shares[shareId].resolved = true
        const payout = SHARE_PAYOUTS[newUser.shares[shareId].outcome]
        if (payout !== undefined) newUser.balance += payout
      }
    }
  }
  setUser(newUser)
}