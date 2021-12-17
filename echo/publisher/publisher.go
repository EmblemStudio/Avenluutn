package publisher

import (
	"math/big"
	"time"
	"fmt"
	"net/http"
	"net/url"
	"io"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"strings"
	"encoding/base64"
	"encoding/json"
	"errors"
	"reflect"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
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

func (p *Publisher) GetScript(
	narratorIndex int64,
	backend bind.ContractBackend,
) (string, error) {
	scriptURI, err := p.GetScriptURI(narratorIndex, backend); if err != nil {
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
			log.Println("script get err:", err)
			return "", err
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body); if err != nil {
			log.Println("script request body read error:", err)
			return "", err
		}
		return string(body), nil
	}
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

type ScriptResult struct {
	Stories []Story `json:"stories"`
	NextState map[string]interface{} `json:"nextState"`
	NextUpdateTime int64 `json:"nextUpdateTime"`
}

func (sr ScriptResult) JSON() (string, error) {
	data, err := json.Marshal(sr)
	if err != nil { return "", err }
	return string(data), nil
}

func (sr ScriptResult) PrettyJSON() (string, error) {
	data, err := json.MarshalIndent(sr, "", "  ")
	if err != nil { return "", err }
	return string(data), nil
}

// RunNarratorScript run a narrator script in node, return next state and some stories
func (pub *Publisher) RunNarratorScript(
	script string,
	previousResult ScriptResult,
	collectionStart int64,
	collectionLength int64,
	collectionSize int64,
) (ScriptResult, string, error) {
	scriptFilePath := "./script.js"
	if err := ioutil.WriteFile(scriptFilePath, []byte(script), 0644); err != nil {
		log.Println("script.js write error:", err)
		return ScriptResult{}, "", err
	}

	var previousResultJSON string
	if reflect.DeepEqual(previousResult, ScriptResult{}) {
		previousResultJSON = "null"
	} else {
		previousResultJSONData, err := json.Marshal(previousResult)
		if err != nil {
			log.Println("previousResult json marshal error", err)
			return ScriptResult{}, "", err
		}
		previousResultJSON = string(previousResultJSONData)
	}

	provider := os.Getenv("AVENLUUTN_PROVIDER")
	if provider == "" {
		log.Fatal("Missing required AVENLUUTN_PROVIDER envar")
	}

	resultFilePath := "./result.json"
	runScript := []byte(fmt.Sprintf(
		`
const fs = require('fs')
const script = require('./script.js')

function save(result) {
   console.log("saving result")
   fs.writeFileSync("%v", JSON.stringify(result))
}

function fail(e) {
    console.log("failed to tell", e)
    throw new Error("ERROR: tellStories failed")
}

console.log("telling stories");

script.tellStories(%v, %v, %v, %v, "%v")
  .then(save)
  .catch(fail)
`,
		resultFilePath,
		previousResultJSON,
		collectionStart,
		collectionLength,
		collectionSize,
		// TODO make eth network configurable
		provider,
	))
	runScriptPath := "./runScript.js"
	if err := ioutil.WriteFile(runScriptPath, runScript, 0644); err != nil {
		log.Println("runScript.js write error:", err)
		return ScriptResult{}, "", err
	}
	out, err := exec.Command("node", runScriptPath).CombinedOutput()
	if err != nil {
		log.Println("NodeJS Error:", err)
	}
	resultJSON, err := ioutil.ReadFile(resultFilePath)
	if err != nil {
		log.Println("read result file error:", err)
		return ScriptResult{}, "", err
	}

	var result ScriptResult
	if err := json.Unmarshal(resultJSON, &result); err != nil {
		log.Println("json unmarshal error", err)
		return ScriptResult{}, "", err
	}
	return result, string(out), nil
}
