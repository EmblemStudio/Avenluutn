import { useQuery } from 'react-query'
import axios from 'axios'

import { Vote, CategorizedVotes, firstArrayElement } from '../utils'
import { SERVER, NETWORK, NARRATOR_INDICES } from '../constants'

export default () => {
  return useQuery(
    [],
    () => getVotes(),
    { enabled: true }
  )
}

async function getVotes(): Promise<CategorizedVotes> {
  const index = firstArrayElement(NARRATOR_INDICES[NETWORK])
  const res = { data: undefined } //await axios.get(`${SERVER}/votes/${index}.json`)
  const data: Vote[] = res.data === undefined ? [] : res.data
  const votes: CategorizedVotes = {
    upcoming: [], inProgress: [], completed: []
  }
  const now = Math.floor(Date.now() / 1000)
  data.forEach(v => {
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
