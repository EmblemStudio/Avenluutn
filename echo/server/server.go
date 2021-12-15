package server

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"errors"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/ethereum/go-ethereum/ethclient"

	"EmblemStudio/aavenluutn/echo/publisher"
)

type SyncChans struct {
	result chan publisher.ScriptResult
	err chan error
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
		fmt.Println(resultKey, "Waiting for results")
		select {
		case result := <-syncChans.result:
			fmt.Println("Got result from result chan")
			return result, nil
		case err := <-syncChans.err:
			fmt.Println("Got error from error chan")
			return publisher.ScriptResult{}, err
		}
	}
	// otherwise make channels for it and send results through for anyone
	// looking for this while we are working on it
	resultChan := make(chan publisher.ScriptResult, 1)
	errorChan := make(chan error, 1)
	fmt.Println(resultKey, "adding sync chans")
	ps.syncChans[resultKey] = SyncChans{resultChan, errorChan}
	defer func() {
		ps.resultsMutex.Lock()
		fmt.Println(resultKey, "deleting sync chans")
		delete(ps.syncChans, resultKey)
		ps.resultsMutex.Unlock()
	}()
	ps.resultsMutex.Unlock()

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
		(collectionIndex * narrator.CollectionLength.Int64())

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
		errorChan <- err
		return publisher.ScriptResult{}, err
	}

	if err := ps.store.Set(
		key(narratorIndex, collectionIndex),
		result,
	); err != nil {
		log.Println(prefix, "WARNING: Could not cache result:", err)
	}

	resultChan <- result
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
