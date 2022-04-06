# Add Votes

To add a vote create a file in /votes like `/votes/{narratorIndex}.json`

The contents of the file should be `[]Proposal` (in json)

```
type Proposal struct {
        // how to identify this vote in the tweet
	MatchString string `json:"matchString"`
	StartTime time.Time `json:"startTime"`
	EndTime time.Time `json:"endTime"`
	// how frequently to update the count
	RefreshSeconds int `json:"refreshSeconds"`
	// short text for the vote
	Summary string `json:"summary"`
	// full text for the vote
	Description string `json:"description"`
	// options like "yay", "nay", or anything else
	VoteOptions []string `json:"voteOptions"`
	VoteCount map[string]int `json:"voteCount"`
}
```

The keeper will watch twitter for votes and keep vote counts up to date