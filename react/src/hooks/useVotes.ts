import { useQuery } from 'react-query'

import { Vote, CategorizedVotes } from '../utils'

export default () => {
  return useQuery(
    [],
    () => mockVotes(),
    { enabled: true }
  )
}

async function mockVotes(): Promise<CategorizedVotes> {
  const res: Vote[] = [{
    "matchString": "rock",
    "startTime": 1680719989,
    "endTime": 1683311989,
    "refreshSeconds": 300,
    "summary": "Upcoming vote summary mock",
    "description": "vote description mock",
    "voteOptions": [
      "Chris",
      "The"
    ],
    "voteCount": {
      "Chris": 16,
      "The": 15
    }
  }, {
    "matchString": "rock",
    "startTime": 1646509189,
    "endTime": 1651775989,
    "refreshSeconds": 300,
    "summary": "In progress vote summary mock",
    "description": "vote description mock",
    "voteOptions": [
      "Chris",
      "The"
    ],
    "voteCount": {
      "Chris": 16,
      "The": 15
    }
  }, {
    "matchString": "rock",
    "startTime": 1554489589,
    "endTime": 1557081589,
    "refreshSeconds": 300,
    "summary": "Completed vote summary mock",
    "description": "vote description mock",
    "voteOptions": [
      "Chris",
      "The"
    ],
    "voteCount": {
      "Chris": 16,
      "The": 15
    }
  }]
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