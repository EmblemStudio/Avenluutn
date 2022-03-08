
import { User, Narrator } from '.'

export function updateUserFromNarrator(user: User, narrator: Narrator, setUser: (value: User) => void) {
  const newUser = Object.assign({}, user)
  for (const shareId in user.shares) {
    const share = user.shares[shareId]
    const collection = narrator.collections[share?.collectionIndex]
    const story = collection?.scriptResult.stories[share.storyIndex]
    newUser.shares[shareId].outcome = story?.finalOutcome || -1
  }
  setUser(newUser)
}