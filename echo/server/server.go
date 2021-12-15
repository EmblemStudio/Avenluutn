package server

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"errors"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/ethereum/go-ethereum/ethclient"

	"EmblemStudio/aavenluutn/echo/publisher"
)

type PubServer struct {
	pub *publisher.Publisher
	store publisher.PublisherStore
	client *ethclient.Client
}

func NewPubServer(
	p *publisher.Publisher,
	s publisher.PublisherStore,
	c *ethclient.Client,
) PubServer {
	return PubServer{p, s, c}
}

func key(a int64, b int64) string {
	return fmt.Sprintf("%v.%v", a, b)
}

// KeepWarm keeps the cache for a given narrator warm by calling
// runNarratorScript when caches become invalid, and when new
// collections are scheduled
func (ps PubServer) KeepWarm(narratorIndex int64) {
	narrator, err := ps.pub.GetNarrator(narratorIndex)
	if err != nil {
		fmt.Println("KeepWarm: ERR", err)
		return
	}

	collectionSize := narrator.TotalCollections.Int64()
	var collectionIndex int64
	collectionIndex = 0
	fmt.Println("KeepWarm: narrator", narratorIndex, "size", collectionSize)
	for collectionIndex < collectionSize {
		fmt.Println(
			"KeepWarm: running",
			narratorIndex,
			collectionIndex,
		)
		result, err := ps.runNarratorScript(
			narratorIndex,
			collectionIndex,
		)
		if err != nil {
			fmt.Println("KeepWarm ERR:", err)
			return
		}

		// if that collection is finished (nextUpdateTime == -1),
		// run the next collection if there is one
		if result.NextUpdateTime == -1 {
			fmt.Println(
				"KeepWarm: Collection finished in the past",
				narratorIndex,
				collectionIndex,
			)
			collectionIndex += 1
		} else {
			// if that collection is not finished, wait
			// until nextUpdateTime and run it again
			untilUpdate := time.Duration(
				result.NextUpdateTime - time.Now().Unix(),
			) * time.Second
			fmt.Println(
				"KeepWarm: Collection",
				narratorIndex,
				collectionIndex,
				"updates in",
				untilUpdate.String(),
			)
			time.Sleep(untilUpdate)
		}
	}
	fmt.Println("KeepWarm: Done with narrator", narratorIndex)
}

func (ps PubServer) runNarratorScript(
	narratorIndex int64,
	collectionIndex int64,
) (publisher.ScriptResult, error) {
	if collectionIndex < 0 {
		return publisher.ScriptResult{}, errors.New("Negative collection index")
	}

	resultKey := key(narratorIndex, collectionIndex)

	prefix := fmt.Sprintf("%v ps.runNarratorScript", resultKey)
	cachedResult, err := ps.store.Get(resultKey)
	if err == nil {
		// we have it cached
		fmt.Println(prefix, "Cache hit!")
		return cachedResult, nil
	}
	fmt.Println(prefix, "Cache miss")

	narrator, err := ps.pub.GetNarrator(narratorIndex)
	if err != nil {
		fmt.Println(prefix, "could not get narrator", err)
		return publisher.ScriptResult{}, err
	}

	collectionStart := narrator.Start.Int64() +
		(collectionIndex * narrator.CollectionSpacing.Int64())

	script, err := ps.pub.GetScript(narratorIndex, ps.client)
	if err != nil {
		fmt.Println(prefix, "could not get script", err)
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
	}

	if err := ps.store.Set(
		key(narratorIndex, collectionIndex),
		result,
	); err != nil {
		log.Println(prefix, "WARNING: Could not cache result:", err)
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
