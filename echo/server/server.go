package server

import (
	"io/ioutil"
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"errors"
	"encoding/hex"
	"text/template"
	"bytes"

	"golang.org/x/crypto/sha3"

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

	if err := ps.store.Set(key(narratorIndex, collectionIndex), result); err != nil {
		log.Println("WARNING: Could not cache result:", err)
	}

	return result, nil

}

func (ps PubServer) RunNarratorScript(c echo.Context) error {
	narratorIndex, err := getInt64Param(c, "narrator")
	if err != nil { return badRequest(err) }

	collectionIndex, err := getInt64Param(c, "collection")
	if err != nil { return badRequest(err) }

	log.Println("RunNarratorScript", narratorIndex, collectionIndex)

	result, err := ps.runNarratorScript(narratorIndex, collectionIndex)
	if err != nil { return serverError(err) }

	responseJSONData, err := json.Marshal(result)
	if err != nil { return serverError(err) }

	return c.String(http.StatusOK, string(responseJSONData))
}

func (ps PubServer) GetStory(c echo.Context) error {
	narratorIndex, err := getInt64Param(c, "narrator")
	if err != nil { return badRequest(err) }

	collectionIndex, err := getInt64Param(c, "collection")
	if err != nil { return badRequest(err) }

	storyIndex, err := getInt64Param(c, "story")
	if err != nil { return badRequest(err) }

	log.Println("GetStory", narratorIndex, collectionIndex, storyIndex)

	result, err := ps.runNarratorScript(narratorIndex, collectionIndex)
	if err != nil { return serverError(err) }

	if int(storyIndex) >= len(result.Stories) {
		return serverError(errors.New("Story index out of bounds"))
	}
	story := result.Stories[storyIndex]

	jsonResponse, err := json.Marshal(story)
	if err != nil { return serverError(err) }

	return c.String(http.StatusOK, string(jsonResponse))
}

func (ps PubServer) RunTestScript(c echo.Context) error {

	formFile, err := c.FormFile("file")
	if err != nil { return badRequest(err) }

	scriptFile, err := formFile.Open()
	if err != nil { return badRequest(err) }
	defer scriptFile.Close()

	scriptData, err := ioutil.ReadAll(scriptFile)
	if err != nil { return badRequest(err) }

	script := string(scriptData)

	previousResultText := c.FormValue("previous-result")
	var previousResult publisher.ScriptResult
	if err := json.Unmarshal([]byte(previousResultText), &previousResult); err != nil {
		return badRequest(err)
	}

	collectionStart, err := getInt64FormValue(c, "collection-start")
	if err != nil { return badRequest(err) }

	collectionLength, err := getInt64FormValue(c, "collection-length")
	if err != nil { return badRequest(err) }

	collectionSize, err := getInt64FormValue(c, "collection-size")
	if err != nil { return badRequest(err) }

	iterations, err := getInt64FormValue(c, "iterations")
	if err != nil { return badRequest(err) }

	cacheBuster := c.FormValue("cache-buster")
	responseTemplate := c.FormValue("template")

	testHash := make([]byte, 32)
	sha3.ShakeSum128(testHash, []byte(fmt.Sprintf(
		"%v%v%v%v%v%v%v",
		script,
		previousResult,
		collectionStart,
		collectionLength,
		collectionSize,
		iterations,
		cacheBuster,
	)))

	testKey := hex.EncodeToString(testHash)

	result, err := ps.store.Get(testKey)
	if err == nil {
		// we have the result
		log.Println("Cache Hit", testKey)
	} else {
		for iterations > 0 {
			result, err := ps.pub.RunNarratorScript(
				script,
				previousResult,
				collectionStart,
				collectionLength,
				collectionSize,
			)
			if err != nil { return serverError(err) }

			previousResult = result
			iterations -= 1
		}
		if err := ps.store.Set(testKey, result); err != nil {
			log.Println("WARNING: Could not cache result:", err)
		}
	}

	responseJSON, err := result.JSON()
	if err != nil {
		return serverError(err)
	}

	if responseTemplate != "" {
		responseTemplate, err := template.New("response").Parse(responseTemplate)
		if err != nil {
			return c.String(http.StatusOK, fmt.Sprintf(
				"%v\n\n%v",
				err,
				responseJSON,
			))
		}
		var b bytes.Buffer
		if err := responseTemplate.Execute(&b, result); err != nil {
			return c.String(http.StatusOK, fmt.Sprintf(
				"%v\n\n%v",
				err,
				responseJSON,
			))
		}
		return c.String(http.StatusOK, b.String())
	}

	return c.String(http.StatusOK, responseJSON)
}
