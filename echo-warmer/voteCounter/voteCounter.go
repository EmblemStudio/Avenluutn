package voteCounter

import ("path/filepath"
	"time"
	"encoding/json"
	"io/ioutil"
	"fmt"
	"log"
	"os"
	"strings"
	"net/http"
)

type TwitterVoteCounter struct {
	Search func(string) []string
}

type Tweet struct {
	ID string `json:"id"`
	Text string `json:"text"`
}

type TwitterResponse struct {
	Data []Tweet `json:"data"`
}

func NewTwitterVoteCounter(
	bearerToken string,
) TwitterVoteCounter {
	twitterEndpoint := "https://api.twitter.com/2/tweets/search/recent"
	bearerToken = fmt.Sprintf("Bearer %v", bearerToken)

	return TwitterVoteCounter{func (searchString string) []string {
		log.Println("Searching twitter for", searchString)
		req, err := http.NewRequest("GET", twitterEndpoint, nil)
		req.Header.Add("Authorization", bearerToken)
		q := req.URL.Query()
		q.Add("query", fmt.Sprintf("\"%v\"", searchString))
		q.Add("max_results", "100")
		q.Add("tweet.fields", "text")
		req.URL.RawQuery = q.Encode()
		client := &http.Client{Timeout: 30 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			log.Println("Twitter API Error", err)
			return []string{}
		}

		data, err := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()
		if err != nil {
			log.Println("Response body read error:", err)
			return []string{}
		}
		var results TwitterResponse
		err = json.Unmarshal(data, &results)
		if err != nil {
			log.Println("Response unmarshal error:", err)
			return []string{}
		}

		tweets := []string{}
		for i := 0; i < len(results.Data); i++ {
			tweets = append(tweets, results.Data[i].Text)
		}
		return tweets
	}}
}

type Proposal struct {
	MatchString string `json:"matchString"`
	StartTime int64 `json:"startTime"`
	EndTime int64 `json:"endTime"`
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

func sendErr(err error, errs chan(error)) bool {
	if err != nil {
		errs <-err
		return true
	}
	return false
}

func (tvc TwitterVoteCounter) CountAllVotes(errs chan(error)) {
	filePaths, err := filepath.Glob("/votes/*.json.conf")
	log.Printf("Found %v vote files\n", len(filePaths))
	if sendErr(err, errs) { return }

	for _, f := range filePaths {
		log.Println("Reading vote config", f)

		data, err := ioutil.ReadFile(f)
		if sendErr(err, errs) { continue }

		var proposals []Proposal
		err = json.Unmarshal(data, &proposals)
		if sendErr(err, errs) { continue }

		// Start the vote counting for this file
		results := make(chan(*Proposal))
		go recordResults(results, strings.TrimSuffix(f, ".conf"))
		for _, p := range proposals {
			go func (proposal Proposal) {
				tvc.monitorVotes(&proposal, results)
			}(p)
		}
	}
}

// monitorVotes periodically updates a proposal with the current vote count
// and sends it down the results channel
func (tvc TwitterVoteCounter) monitorVotes(
	pc *Proposal,
	results chan(*Proposal),
) {
	log.Println("Monitoring votes for", pc.MatchString)
	untilVoteStarts := time.Unix(pc.StartTime, 0).Sub(time.Now())
	log.Printf(
		"Waiting %v seconds until %v vote starts\n",
		untilVoteStarts,
		pc.MatchString,
	)
	time.Sleep(untilVoteStarts)

	for time.Now().Before(time.Unix(pc.EndTime, 0)) {
		// Count up the votes on twitter
		tvc.countVotes(pc, results)
		time.Sleep(time.Duration(pc.RefreshSeconds) * time.Second)
	}

	log.Printf("%v vote ended", pc.MatchString)
	tvc.countVotes(pc, results)
}

func (tvc TwitterVoteCounter) countVotes(
	pc *Proposal,
	results chan(*Proposal),
) {
	log.Println("Counting votes", pc.MatchString)

	// get the text of all the tweets
	tweets := tvc.Search(pc.MatchString)

	count := make(map[string]int)
	for _, tweet := range tweets {
		// Count this as a vote for a choice if it mentions the choice
		// This may result in counting as a vote for multiple options
		// :shrug: that's fine!
		for _, o := range pc.VoteOptions {
			if strings.Contains(tweet, o) {
				count[o] += 1
			}
		}
	}

	pc.VoteCount = count

	results <- pc
}

func recordResults(
	results chan(*Proposal),
	filePath string,
) {
	// Record it every time we get a new result (until it's done)
	for {
		log.Println("Waiting for results to record to",	filePath)
		result, more := <-results
		if !more { return }
		// Read the narrator file
		var proposals []Proposal
		data, err := ioutil.ReadFile(filePath)
		if err != nil {
			log.Println(
				"Could not read proposals for update",
				filePath,
			)
			continue
		}
		err = json.Unmarshal(data, &proposals)
		if err != nil {
			log.Println(
				"Could not unmarshal proposals for update\n",
				err,
			)
			continue
		}

		// Update the result we got
		// find the proposal to update
		found := false
		for i := 0; i<len(proposals); i++ {
			if proposals[i].MatchString == result.MatchString {

				// replace the proposal with the result, a
				// (proposal with the updated count)

				proposals[i] = *result
				found = true
				break
			}
		}

		if !found {
			log.Println(
				"Could not find proposal to update matching",
				result.MatchString,
			)
		}

		// Write back the narrator file
		data, err = json.MarshalIndent(proposals, "", "  ")
		if err != nil {
			log.Println(
				"Could not write results\n",
				filePath,
				"\n",
				err,
			)
		}
		log.Println("Writing updated proposals", filePath)
		os.WriteFile(filePath, data, 0644)
	}
}
