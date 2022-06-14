import { useQuery } from 'react-query'
import axios from 'axios'

import { Vote, CategorizedVotes } from '../utils'
import { SERVER, NETWORK, NARRATOR_INDICES } from '../constants'

export default () => {
  return useQuery(
    [],
    () => getVotes(),
    { enabled: true }
  )
}

export interface VotesByNarrator { [index: number]: CategorizedVotes }

async function getVotes(): Promise<VotesByNarrator> {
  const votes: VotesByNarrator = {}
  const now = Math.floor(Date.now() / 1000)
  for (let i = 0; i < NARRATOR_INDICES[NETWORK].length; i++) {
    const index = NARRATOR_INDICES[NETWORK][i]
    if (index !== undefined) {
      try {
        const subRes = await axios.get(`${SERVER}/votes/${index}.json`)
        if (subRes.data !== undefined) {
          const subVotes: CategorizedVotes = {
            upcoming: [], inProgress: [], completed: []
          }
          subRes.data.forEach((v: Vote) => {
            if (v.startTime > v.endTime) {
              console.log("Vote startTime not before endTime", v)
            } else if (v.startTime > now) {
              subVotes.upcoming.push(v)
            } else if (v.startTime <= now && v.endTime > now) {
              subVotes.inProgress.push(v)
            } else if (v.startTime <= now && v.endTime <= now) {
              subVotes.completed.push(v)
            } else {
              console.log("Couldn't categorize vote:", v)
            }
          })
          votes[index] = subVotes
        }
      } catch (e) {
        console.log('Failed to load votes for', i, e)
      }
    }
  }
  return votes
}
