package publisher

import (
	"math/big"
	"time"
	"fmt"
	"net/http"
	"net/url"
	"io"
	"strings"
	"encoding/base64"
	"encoding/json"
	"errors"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	v8 "rogchap.com/v8go"
)

func (p *Publisher) GetNarrator(i int64) (PublisherNarrator, error) {
	return p.Narrators(nil, big.NewInt(i))
}

func (p *Publisher) GetScriptURI(i int64, backend bind.ContractBackend) (*url.URL, error) {
	narrator, err := p.GetNarrator(i)
	if err != nil {
		return &url.URL{}, err
	}
	nft, err := NewNarratorNFTs(narrator.NFTAddress, backend)
	if err != nil {
		return &url.URL{}, err
	}
	uriString, err := nft.TokenURI(nil, narrator.NFTId); if err != nil {
		return &url.URL{}, err
	}
	return url.Parse(uriString)
}

var scriptCache string
func (p *Publisher) GetScript(i int64, backend bind.ContractBackend) (string, error) {
	if scriptCache != "" {
		return scriptCache, nil
	}
	scriptURI, err := p.GetScriptURI(i, backend); if err != nil {
		return "", err
	}

	switch scriptURI.Scheme {
	case "data":
		_, script, err := parseOpaqueData(scriptURI.Opaque); if err != nil {
			return "", err
		}
		return script, nil
	default:
		resp, err := http.Get(scriptURI.String()); if err != nil {
			fmt.Println("script get err:", err)
			return "", err
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body); if err != nil {
			fmt.Println("script request body read error:", err)
			return "", err
		}
		return string(body), nil
	}
}

func (pub *Publisher) GetStory(
	backend bind.ContractBackend,
	ps PublisherStore,
	narratorIndex int64,
	collectionIndex int64,
	storyIndex int64,
) (Story, error) {
	return pub.GetStoryAsOf(
		backend,
		ps,
		narratorIndex,
		collectionIndex,
		storyIndex,
		ps.Now(),
	)
}

func LatestBlockTime(ps PublisherStore) (time.Time, error) {
	return ps.LatestBlockTimeAsOf(ps.Now())
}

func GetStateKey(
	ps PublisherStore,
	narrator int64,
	collection int64,
	story int64,
	t time.Time,
) string {
	return fmt.Sprintf("%v.%v.%v.%v", narrator, collection,	story, t.Unix())
}

func GetCachedResult(
	ps PublisherStore,
	narratorIndex int64,
	collectionIndex int64,
	storyIndex int64,
	t time.Time,
) (ScriptResult, error) {
	stateKey := GetStateKey(ps, narratorIndex, collectionIndex, storyIndex, t)
	result, err := ps.Get(stateKey)
	return result, err
}

func parseOpaqueData(opaque string) (string, string, error) {
	mediaTypeSplit := strings.Split(opaque, ",")
	if len(mediaTypeSplit) < 2 {
		return "", "", errors.New("Missing data URI media type")
	}
	mediaType := mediaTypeSplit[0]
	data := strings.Join(mediaTypeSplit[1:], ",")
	if strings.Index(mediaType, ";base64") != -1 {
		decoded, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			return "", "", err
		}
		data = string(decoded)
	}
	return strings.Split(mediaType, ";")[0], data, nil
}

type Story = interface{}

// TODO refactor so the server is result generic.
// rather than returning stories it retuns generic results
// allowing the UI and Script to coordinate on that
type ScriptResult struct {
	Stories []Story `json:"stories"`
	NextState map[string]interface{} `json:"nextState"`
}

// RunNarratorScript run a narrator script in V8, return next state and some stories
func (pub *Publisher) RunNarratorScript(
	script string,
	previousResult string,
	collectionStart int64,
	collectionLength int64,
	collectionSize int64,
) (ScriptResult, error) {
	fmt.Println("running script")
	jsVM, _ := v8.NewContext()

	// script must define a tellStory function that takes an initial state
	// and returns { state: mapping, stories: string[] }
	if _, err := jsVM.RunScript(
		script,
		"index.js",
	); err != nil {
		fmt.Println("RunScript error", err)
		return ScriptResult{}, err
	}

	functionCall := fmt.Sprintf(
		"tellStory(%v, %v, %v, %v, %v)",
		previousResult,
		collectionStart,
		collectionLength,
		collectionSize,
		"'localhost:8545'", // todo make providerURL configurable?
	)

	value, err := jsVM.RunScript(functionCall, "index.js")
	if err != nil {
		fmt.Println("js function call error", err)
		return ScriptResult{}, err
	}
	promise, err := value.AsPromise()
	if err != nil {
		fmt.Println("as promise error", err)
		return ScriptResult{}, err
	}

	for promise.State() == v8.Pending {
		time.Sleep(100 * time.Millisecond)
	}

	if promise.State() == v8.Rejected {
		fmt.Println("promise rejected", promise)
		return ScriptResult{}, errors.New("rejected promise")
	}

	resultJSON, err := json.Marshal(promise.Result()); if err != nil {
		fmt.Println("result marshal error", err)
		return ScriptResult{}, err
	}

	var result ScriptResult
	if err := json.Unmarshal(resultJSON, &result); err != nil {
		fmt.Println("json unmarshal error", err)
		return ScriptResult{}, err
	}
	fmt.Println(result.Stories)
	return result, nil
}

// before compares a go time.Time and a big.Int from the contract
// intrepreted as a unix timestamp
func before(a time.Time, b *big.Int) bool {
	bTime := time.Unix(b.Int64(), 0)
	return a.Before(bTime)
}

func (pub *Publisher) GetStoryAsOf(
	backend bind.ContractBackend,
	ps PublisherStore,
	narratorIndex int64,
	collectionIndex int64,
	storyIndex int64,
	t time.Time,
) (Story, error) {
	narrator, err := pub.GetNarrator(narratorIndex); if err != nil {
		return "", err
	}

	// if the story is over, jump to the end,
	// don't run it for all the blocks after that
	storyEnd := narrator.Start.Int64() + narrator.CollectionLength.Int64()
	if storyEnd < t.Unix() {
		t = time.Unix(storyEnd, 0)
	}

	latestBlockTime, err := ps.LatestBlockTimeAsOf(t)
	if err != nil {
		return "", err
	}

	// if latestBlockTime is before the narrator start time
	// use `{}` as the state
	_, err = GetCachedResult(
		ps,
		narratorIndex,
		collectionIndex,
		storyIndex,
		latestBlockTime,
	)
	if err != nil && !before(latestBlockTime, narrator.Start) {
		// We don't have the result in the cache...
		// and it's after the start time...
		// so we need to get it by recursing and getting the state
		// as of a time just before the most recent block time
		pub.GetStoryAsOf(
			backend,
			ps,
			narratorIndex,
			collectionIndex,
			storyIndex,
			latestBlockTime.Add(time.Second * -1), // a second before
		)
	}

	var state string
	if before(latestBlockTime, narrator.Start) {
		state = "{}"
	} else { // cache should be warmed now
		hitResult, err := GetCachedResult(
			ps,
			narratorIndex,
			collectionIndex,
			storyIndex,
			latestBlockTime,
		)
		if err != nil {
			return "", err
		}
		marshaled, err := json.Marshal(hitResult); if err != nil {
			return "", err
		}
		state = string(marshaled)
	}

	collectionStart := narrator.Start.Int64() +
		narrator.CollectionSpacing.Int64() * collectionIndex

	script, err := pub.GetScript(narratorIndex, backend); if err != nil {
		return "", err
	}
	result, err := pub.RunNarratorScript(
		script,
		state,
		collectionStart,
		narrator.CollectionLength.Int64(),
		narrator.CollectionSize.Int64(),
	); if err != nil {
		return "", err
	}


	// This has to save for the next future block time
	// not the latest block time
	nextBlockTime, noNextBlockErr := ps.NextBlockTimeAsOf(t)

	if noNextBlockErr == nil {
		// if there is a next block, save this result against it
		stateKey := GetStateKey(
			ps,
			narratorIndex,
			collectionIndex,
			storyIndex,
			nextBlockTime,
		)
		ps.Set(stateKey, result)
	}
	if int(storyIndex) >= len(result.Stories) {
		return "", errors.New("Story index out of bounds")
	}
	return result.Stories[storyIndex], nil
}
