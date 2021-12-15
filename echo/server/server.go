package server

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"errors"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/ethereum/go-ethereum/ethclient"

	"EmblemStudio/aavenluutn/echo/publisher"
)

type SyncChans struct {
	results []chan publisher.ScriptResult
	errs []chan error
	mutex sync.Mutex
}

type PubServer struct {
	pub *publisher.Publisher
	store publisher.PublisherStore
	client *ethclient.Client
	syncChans map[string]SyncChans
	resultsMutex sync.Mutex
}

func NewPubServer(
	p *publisher.Publisher,
	s publisher.PublisherStore,
	c *ethclient.Client,
) PubServer {
	return PubServer{p, s, c, make(map[string]SyncChans), sync.Mutex{}}
}

func key(a int64, b int64) string {
	return fmt.Sprintf("%v.%v", a, b)
}

// KeepWarm keeps the cache for a given narrator warm by calling
// runNarratorScript when caches become invalid, and when new
// collections are scheduled
func (ps PubServer) KeepWarm(
	narratorIndexes chan(int64),
	stop chan(bool),
	errs chan(error),
) {

	type WarmResult struct {
		scriptResult publisher.ScriptResult
		err error
		narratorIndex int64
		collectionIndex int64
	}
	results := make(chan WarmResult)

	// latest collection we've completed for each narrator
	collections := make(map[int64]int64)

	runScriptAsync := func(
		narratorIndex int64,
	) {
		collectionIndex, _ := collections[narratorIndex]
		scriptResult, err := ps.runNarratorScript(
			narratorIndex,
			collectionIndex,
		)
		if err != nil {
			results <- WarmResult{
				publisher.ScriptResult{},
				err,
				narratorIndex,
				collectionIndex,
			}
		} else {
			results <- WarmResult{
				scriptResult,
				nil,
				narratorIndex,
				collectionIndex,
			}
		}
	}

	for {
		select {
		case narratorIndex := <-narratorIndexes:
			// runNarratorScript for the collection
			go runScriptAsync(narratorIndex)
		case result := <-results:
			if result.err != nil {
				errs <- result.err
				continue
			}
			// if that collection is finished
			// (nextUpdateTime == -1), run the next
			// collection if there is one
			if result.scriptResult.NextUpdateTime == -1 {
				collections[result.narratorIndex] += 1
				go runScriptAsync(result.narratorIndex)
			} else {
				// if that collection is not finished,
				// wait until nextUpdateTime and run
				// it again
				secondsUntilUpdate := result.scriptResult.NextUpdateTime - time.Now().Unix()
				go func() {
					<-time.NewTimer(time.Duration(secondsUntilUpdate) * time.Second).C
					runScriptAsync(result.narratorIndex)
				}()
			}
		case done := <-stop:
			if done == true {
				break
			}
		}
	}
}

func (ps PubServer) runNarratorScript(
	narratorIndex int64,
	collectionIndex int64,
) (publisher.ScriptResult, error) {
	if collectionIndex < 0 {
		return publisher.ScriptResult{}, errors.New("Negative collection index")
	}

	resultKey := key(narratorIndex, collectionIndex)

	// if there is already a channel open for this result
	ps.resultsMutex.Lock()
	syncChans, present := ps.syncChans[resultKey]
	if present {
		// just wait for it
		ps.resultsMutex.Unlock()
		syncChans.mutex.Lock()
		resultChan := make(chan publisher.ScriptResult{})
		errChan := make(chan err)
		syncChans.results = append(syncChans.results, resultChan)
		syncChans.errs = append(syncChans.errs, errChan)
		ps.syncChans[resultKey] = syncChans
		syncChans.mutex.Unlock()
		fmt.Println(resultKey, "Waiting for results")
		select {
		case result := <-resultChan:
			fmt.Println("Got result from result chan")
			return result, nil
		case err := <-errChan:
			fmt.Println("Got error from error chan")
			return publisher.ScriptResult{}, err
		}
	}

	prefix := fmt.Sprintf("%v ps.runNarratorScript", resultKey)
	cachedResult, err := ps.store.Get(resultKey)
	if err == nil {
		// we have it cached
		fmt.Println(prefix, "Cache hit!")
		resultChan <- cachedResult
		return cachedResult, nil
	}
	fmt.Println(prefix, "Cache miss")

	narrator, err := ps.pub.GetNarrator(narratorIndex)
	if err != nil {
		fmt.Println(prefix, "could not get narrator", err)
		errorChan <- err
		return publisher.ScriptResult{}, err
	}

	collectionStart := narrator.Start.Int64() +
		(collectionIndex * narrator.CollectionSpacing.Int64())

	script, err := ps.pub.GetScript(narratorIndex, ps.client)
	if err != nil {
		fmt.Println(prefix, "could not get script", err)
		errorChan <- err
		return publisher.ScriptResult{}, err
	}

	var previousResult publisher.ScriptResult
	if collectionIndex == 0 {
		previousResult = publisher.ScriptResult{}
	} else {
		fmt.Println(key(narratorIndex, collectionIndex), "getting previous result")
		// recurse
		previousResult, err = ps.runNarratorScript(
			narratorIndex,
			collectionIndex - 1,
		)
		if err != nil {
			fmt.Println(
				prefix,
				"could not get previous result",
				err,
			)
			errorChan <- err
			return publisher.ScriptResult{}, err
		}
	}

	result, err := ps.pub.RunNarratorScript(
		script,
		previousResult,
		collectionStart,
		narrator.CollectionLength.Int64(),
		narrator.CollectionSize.Int64(),
	)
	if err != nil {
		fmt.Println(
			key(narratorIndex, collectionIndex),
			"could not get result",
			err,
		)
			// otherwise send results through to all the registered channels
		syncChans, present := ps.syncChans[resultKey]
		if present {
			syncChans.mutex.Lock()
			for _, errorChan := range syncChans.errs {
				 // TODO give this a timeout
				go func() { errorChan <- err }()
			}
			syncChans.mutex.Unlock()
		}
		return publisher.ScriptResult{}, err
	}

	if err := ps.store.Set(
		key(narratorIndex, collectionIndex),
		result,
	); err != nil {
		log.Println(prefix, "WARNING: Could not cache result:", err)
	}

	syncChans, present := ps.syncChans[resultKey]
	if present {
		syncChans.mutex.Lock()
		for _, resultChan := range syncChans.results {
			go func() { resultChan <- result }()
		}
	}
	return result, nil

}

func (ps PubServer) ExecuteRun(c echo.Context) error {
	narratorIndex, err := getInt64Param(c, "narrator")
	if err != nil { return badRequest(err) }

	collectionIndex, err := getInt64Param(c, "collection")
	if err != nil { return badRequest(err) }

	fmt.Println(fmt.Sprintf(
		"Executing run %v %v",
		narratorIndex,
		collectionIndex,
	))

	result, err := ps.runNarratorScript(narratorIndex, collectionIndex)
	if err != nil {
		fmt.Println("==> ExecuteRun runNarratorScript error", err)
		return serverError(err)
	}

	responseJSONData, err := json.Marshal(result)
	if err != nil {
		fmt.Println("==> ExecuteRun could not marshal result", err)
		return serverError(err)
	}

	return c.String(http.StatusOK, string(responseJSONData))
}
