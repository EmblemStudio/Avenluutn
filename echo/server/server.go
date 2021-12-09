package server

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"errors"

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

func (ps PubServer) runNarratorScript(
	narratorIndex int64,
	collectionIndex int64,
) (publisher.ScriptResult, error) {
	if collectionIndex < 0 {
		return publisher.ScriptResult{}, errors.New("Negative collection index")
	}

	cachedResult, err := ps.store.Get(key(narratorIndex, collectionIndex))
	if err == nil {
		// we have it cached
		return cachedResult, nil
	}

	narrator, err := ps.pub.GetNarrator(narratorIndex)
	if err != nil { return publisher.ScriptResult{}, err }

	collectionStart := narrator.Start.Int64() +
		(collectionIndex * narrator.CollectionLength.Int64())

	script, err := ps.pub.GetScript(narratorIndex, ps.client)
	if err != nil { return publisher.ScriptResult{}, err }

	var previousResult publisher.ScriptResult
	if collectionIndex == 0 {
		previousResult = publisher.ScriptResult{}
	} else {
		previousResult, err = ps.runNarratorScript(
			narratorIndex,
			collectionIndex - 1,
		)
		if err != nil {	return publisher.ScriptResult{}, err }
	}

	result, err := ps.pub.RunNarratorScript(
		script,
		previousResult,
		collectionStart,
		narrator.CollectionLength.Int64(),
		narrator.CollectionSize.Int64(),
	)
	if err != nil {
		return publisher.ScriptResult{}, err
	}

	if err := ps.store.Set(
		key(narratorIndex, collectionIndex),
		result,
	); err != nil {
		log.Println("WARNING: Could not cache result:", err)
	}

	return result, nil

}

func (ps PubServer) ExecuteRun(c echo.Context) error {
	narratorIndex, err := getInt64Param(c, "narrator")
	if err != nil { return badRequest(err) }

	collectionIndex, err := getInt64Param(c, "collection")
	if err != nil { return badRequest(err) }

	log.Println(fmt.Sprintf(
		"Executing run %v %v",
		narratorIndex,
		collectionIndex,
	))

	result, err := ps.runNarratorScript(narratorIndex, collectionIndex)
	if err != nil { return serverError(err) }

	responseJSONData, err := json.Marshal(result)
	if err != nil { return serverError(err) }

	return c.String(http.StatusOK, string(responseJSONData))
}
