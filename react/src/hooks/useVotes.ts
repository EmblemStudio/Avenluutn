import { useQuery } from 'react-query'
import axios from 'axios'

import { Vote, CategorizedVotes } from '../utils'
import { ADDRESSES, SERVER, CACHE_PERIOD, LOADING, NARRATOR_PARAMS } from '../constants'

export default () => {
  return useQuery(
    [],
    () => mockVotes(),
    { enabled: true }
  )
}

async function mockVotes(): Promise<CategorizedVotes> {
  // TODO '0' should be replaced with NARRATOR_PARAMS.narratorIndex once a valid votes object is up
  const res: Vote[] = (await axios.get(`${SERVER}/votes/${0}.json`)).data
  const votes: CategorizedVotes = {
    upcoming: [], inProgress: [], completed: []
  }
  const now = Math.floor(Date.now() / 1000)
  res.forEach(v => {
    if (v.startTime > v.endTime) {
      console.log("Vote startTime not before endTime", v)
    } else if (v.startTime > now) {
      votes.upcoming.push(v)
    } else if (v.startTime <= now && v.endTime > now) {
      votes.inProgress.push(v)
    } else if (v.startTime <= now && v.endTime <= now) {
      votes.completed.push(v)
    } else {
      console.log("Couldn't categorize vote:", v)
    }
  })
  return votes
}