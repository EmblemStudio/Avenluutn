package main

import (
	"log"
	"io"
	"os"
	"fmt"
	"net/http"
	"errors"
	"math/big"
	"strings"
	"encoding/json"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/common"

)

/*
 * The metadata server generates and serves the token metadata
 * It needs to take in a tokenId and return that token's json metadata
 */

const (
	description = "Generative adventure stories in the lootverse"
	baseExternalURI = "https://avenluutn.squad.games/story"
)

var (
	APIbaseURI string
)

// main serves token metadata by token id /tokens/:tokenId -> Token
func main() {
	log.Println("Starting Avenluutn Metadata Server")

	pubHexAddress := os.Getenv("AVENLUUTN_PUB_ADDR")
	if pubHexAddress == "" {
		log.Fatal("Missing required AVENLUUTN_PUB_ADDR envar")
	}
	log.Println("Publisher address", pubHexAddress)

	provider := os.Getenv("AVENLUUTN_PROVIDER")
	if provider == "" {
		log.Fatal("Missing required AVENLUUTN_PROVIDER envar")
	}
	log.Println("Provider", provider)

	APIbaseURI = os.Getenv("AVENLUUTN_API_BASE_URI")
	if APIbaseURI == "" {
		log.Fatal("Missing required AVENLUUTN_API_BASE_URI")
	}

	client, err := ethclient.Dial(provider)
	if err != nil {
		log.Fatal(err)
	}
	pubAddress := common.HexToAddress(pubHexAddress)
	pub, err := NewPublisher(pubAddress, client)
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("tokens/:tokenID", pub.getTokenMetadata)
	e.GET("stories/:tokenID", pub.getStoryData)

	e.Logger.Fatal(e.Start(":8000"))
}

func (p *Publisher) getStoryData(c echo.Context) error {
	tokenID, err := getInt64Param(c, "tokenID")
	if err != nil {
		e := errors.New("Invalid tokenID, expecting int64")
		return badRequest(e);
	}

	storyInfo, err := p.getStoryInfo(tokenID)
	if err != nil {
		e := errors.New(fmt.Sprintf("Could not get story\n%v", err))
		return serverError(e);
	}

	run, err := p.GetRun(storyInfo)
	if err != nil {
		e := errors.New(fmt.Sprintf("Could not get run\n%v"))
		return serverError(e)
	}

	data, err := json.MarshalIndent(
		run.Stories[storyInfo.Index],
		"",
		"<span style='color: lightgray'>|</span>  ",
	)
	if err != nil {
		e := errors.New(fmt.Sprintf("Could not unmarshal story\n%v", err))
		return serverError(e)
	}
	return c.HTML(
		http.StatusOK,
		fmt.Sprintf(
			"<pre>%v</pre>",
			string(data),
		),
	)
}

func makeAdventurersByName(run Run) map[string]Adventurer {
	var adventurersByName map[string]Adventurer
	for _, g := range(run.NextState.Guilds) {
		for _, a := range(g.Adventurers) {
			nameParts := []string{}
			if a.Name.Prefix != "" {
				nameParts = append(nameParts, a.Name.Prefix)
			}
			if a.Name.FirstName != "" {
				nameParts = append(nameParts, a.Name.FirstName)
			}
			if a.Name.MiddleName != "" {
				nameParts = append(nameParts, a.Name.MiddleName)
			}
			if a.Name.LastName != "" {
				nameParts = append(nameParts, a.Name.LastName)
			}
			if a.Name.Suffix != "" {
				nameParts = append(nameParts, a.Name.Suffix)
			}
			name := strings.Join(nameParts, " ")
			adventurersByName[name] = a
		}
	}
	return adventurersByName
}

// getTokenMetadata handler to get token metadata
func (p *Publisher) getTokenMetadata(c echo.Context) error {
	tokenID, err := getInt64Param(c, "tokenID")
	if err != nil {
		e := errors.New("Invalid tokenID, expecting int64")
		return badRequest(e);
	}

	log.Println("Getting token metadata: tokenID", tokenID)

	storyInfo, err := p.getStoryInfo(tokenID)
	if err != nil {
		e := errors.New(fmt.Sprintf("Could not get story\n%v", err))
		return serverError(e);
	}

	log.Println("Got StoryInfo", storyInfo)

	run, err := p.GetRun(storyInfo)
	if err != nil {
		e := errors.New(fmt.Sprintf("Could not get run\n%v", err))
		return serverError(e)
	}

	log.Println("Got story", run.Stories[storyInfo.Index])

	aByName := makeAdventurersByName(run)
	log.Println(fmt.Sprintf("%+v", aByName)
	meta, err := newStoryMeta(
		run.Stories[storyInfo.Index],
		storyInfo,
		aByName,
	)
	if err != nil {
		e := errors.New(
			fmt.Sprintf(
				"Could not make metadata from story\n%v",
				err,
			),
		)
		return serverError(e)
	}

	return c.JSON(http.StatusOK, meta)
}

// fmtStoryMetadata returns StoryMeta given a story
func newStoryMeta(
	s Story,
	si StoryInfo,
	adventurersByName map[string]Adventurer,
) (StoryMeta, error) {

	guildName, err := findGuildName(s.RichText.Beginning)
	if err != nil {
		log.Println(fmt.Sprintf("Could not find guild name\n%v", err))
		guildName = "The Guild"
	}

	adventurers, err := findAdventurers(s.RichText.Beginning, adventurersByName)
	if err != nil {
		log.Println(fmt.Sprintf("Could not find adventurers\n%v", err))
		adventurers = "some adventurers"
	}

	questText, err := makeQuestText(s.RichText.Beginning)
	if err != nil {
		log.Println(fmt.Sprintf("Could not make quest text\n%v", err))
		questText = "be daring and mighty!"
	}
	summary := fmt.Sprintf(
		"In the name of %s,\n%s\naccept their quest to\n %s",
		guildName,
		adventurers,
		questText,
	)

	questConjunctive, err := findQuestConjunctive(s.RichText.Beginning)
	if err != nil {
		log.Println(fmt.Sprintf("Could not find quest conjunctive\n,%v", err))
		questConjunctive = "a"
	}

	questObjective, err := findQuestObjective(s.RichText.Beginning)
	if err != nil {
		log.Println(fmt.Sprintf("Could not find quest objective\n%v", err))
		questObjective = "difficult problem"
	}

	name := fmt.Sprintf(
		"%v and %v %v [%v-%v-%v]",
		guildName,
		questConjunctive, // the conjunctive right after questType
		questObjective,
		si.NarratorIndex,
		si.CollectionIndex,
		si.Index,
	)

	imageSVG := makeImageSVG(name, summary)

	var storyMeta StoryMeta
	storyMeta.Name = name
	storyMeta.Description = description
	storyMeta.Image = imageSVG
	storyMeta.AnimationURL = "Not Implemented" // imageHTML
	storyMeta.ExternalURL = "Not Implemented" // externalURL
	storyMeta.Attributes = []Attribute{} // attributes

	return storyMeta, nil
}

// *Publisher.getStoryInfo gets a StoryInfo by tokenID
func (p *Publisher) getStoryInfo(tokenID int64) (StoryInfo, error) {

	storyID, err := p.MintedStories(nil, big.NewInt(tokenID))
	if err != nil {
		return StoryInfo{}, errors.New(fmt.Sprintf(
			"Could not get StoryInfo for tokenID %v\n%v",
			tokenID,
			err,
		))
	}

	s, err := p.Stories(nil, storyID)
	if err != nil {
		return StoryInfo{}, errors.New(
			fmt.Sprintf("Could not find story %v", storyID),
		)
	}

	return StoryInfo{
		s.NarratorIndex.Int64(),
		s.CollectionIndex.Int64(),
		s.Index.Int64(),
		s.Minted,
		s.NftId.Int64(),
	}, nil
}

// GetRun gets run data from the runs api by narrator index and collection index
func (p *Publisher) GetRun(s StoryInfo) (Run, error) {
	runURL := fmt.Sprintf(
		"%v/runs/%v.%v.json",
		APIbaseURI,
		s.NarratorIndex,
		s.CollectionIndex,
	)

	res, err := http.Get(runURL)
	if err != nil {
		return Run{}, errors.New(
			fmt.Sprintf("Could not get run %v (%v)", runURL, err),
		)
	}

	body, err := io.ReadAll(res.Body)
	res.Body.Close()
	if res.StatusCode > 299 {
		return Run{}, errors.New(fmt.Sprintf(
			"Get run error (%v)\n%v",
			res.StatusCode,
			string(body),
		))
	}
	if err != nil {
		return Run{}, errors.New(
			fmt.Sprintf("Get run error\n%v", err),
		)
	}

	var run Run
	err = json.Unmarshal(body, &run)
	if err != nil {
		return Run{}, errors.New(
			fmt.Sprintf("Get run json error\n%v", err),
		)
	}

	return run, nil
}
