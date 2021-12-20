package warmer

import (
	"os"
	"fmt"
	"log"
	"errors"
	"time"
	"net/http"
	"encoding/json"
	"html/template"
	"bytes"
	"sort"

	"github.com/labstack/echo/v4"
	"github.com/ethereum/go-ethereum/ethclient"

	"EmblemStudio/aavenluutn/echo/publisher"
)

type PubWarmer struct {
	pub *publisher.Publisher
	store publisher.PublisherStore
	client *ethclient.Client
	info map[int64]NarratorInfo
}

type CollectionStatus int64

const (
	Unknown CollectionStatus = iota
	Running                   // Currently running the script
	Scheduled                 // There are future runs for this collection
	Complete                  // No future runs
	Failed                    // There was a failure
)

func (rs CollectionStatus) MarshalJSON() ([]byte, error) {
	switch rs {
	case Unknown:
		return json.Marshal("Unknown")
	case Running:
		return json.Marshal("Running")
	case Scheduled:
		return json.Marshal("Scheduled")
	case Complete:
		return json.Marshal("Complete")
	case Failed:
		return json.Marshal("Failed")
	}
	return json.Marshal("Invalid")
}

func (rs CollectionStatus) String() (string) {
	switch rs {
	case Unknown:
		return "Unknown"
	case Running:
		return "Running"
	case Scheduled:
		return "Scheduled"
	case Complete:
		return "Complete"
	case Failed:
		return "Failed"
	}
	return "Invalid"
}

type CollectionInfo struct {
	Status CollectionStatus
	ScriptOutputHistory map[time.Time] string // paths to historic output
	ScriptResultHistory map[time.Time] string // paths to historic results
	StatusHistory map[time.Time]CollectionStatus
	NextUpdateTime time.Time
}

type NarratorInfo struct {
	totalCollections int64
	scriptErrors []string
	collections map[int64]CollectionInfo
}

func (pw PubWarmer) GetCollectionInfo(c echo.Context) error {
	narratorIndex, err := getInt64Param(c, "narrator")
	if err != nil { return badRequest(err) }

	collectionIndex, err := getInt64Param(c, "collection")
	if err != nil { return badRequest(err) }

	// Maybe the warmer failed, if so there should be a failure file
	failurePath := fmt.Sprintf(
		"/info/failure_%v.%v.json",
		narratorIndex,
		collectionIndex,
	)
	failureData, _ := os.ReadFile(failurePath)

	narratorInfo, present := pw.info[narratorIndex]
	if !present { return notFound() }

	collectionInfo, present := narratorInfo.collections[collectionIndex]
	if !present { return notFound()	}

	var fullOutputHistory = make(map[time.Time]string)
	for t, path := range collectionInfo.ScriptOutputHistory {
		data, err := os.ReadFile(path)
		if err != nil {
			fullOutputHistory[t] = fmt.Sprintf("Error reading %v, (%v)", path, err)
		} else {
			fullOutputHistory[t] = string(data)
		}
	}

	var fullRunHistory = make(map[time.Time]string)
	for t, path := range collectionInfo.ScriptResultHistory {
		data, err := os.ReadFile(path)
		if err != nil {
			fullRunHistory[t] = fmt.Sprintf("Error reading %v, (%v)", path, err)
		} else {
			fullRunHistory[t] = string(data)
		}
	}

	allCollectionsByStatus := make(map[string][]int64)
	for collectionIndex, collectionInfo := range narratorInfo.collections {
		status := collectionInfo.Status.String()
		indexes := allCollectionsByStatus[status]
		indexes = append(indexes, collectionIndex)
		sort.Slice(indexes, func(i, j int) bool { return indexes[i] < indexes[j] })
		allCollectionsByStatus[status] = indexes
	}

	fmt.Println("getting updatesin")
	updatesIn := collectionInfo.NextUpdateTime.Sub(time.Now()).Round(time.Second)
	fmt.Println("Updates in", updatesIn)

	const tmplText = `
<h1>Narrator Index:   {{ .NarratorIndex }}</h1>
<h1>Collection Index: {{ .CollectionIndex }}</h1>
<h1>Updates In        {{ .UpdatesIn }}</h1>
<h4>Next Update Time: {{ .CollectionInfo.NextUpdateTime }}</h4>

<h2>Full Output History </h2>
{{- range $key, $val := .FullOutputHistory }}
  <details>
    <summary>{{ $key }}</summary>
    <pre>{{ $val }}</pre>
  </details>
{{- end }}
<h2>Full Run History</h1>
{{- range $key, $val := .FullRunHistory }}
  <details>
    <summary>{{ $key }}</summary>
    <pre>{{ $val }}</pre>
  </details>
{{- end }}
<h2>Failure</h2>
<pre> {{ .Failure }} </pre>
<h2>All Collections By Status</h2>
  {{- range $status, $collectionIndexes := .AllCollectionsByStatus }}
    <h3>{{ $status }}</h3>
    {{- range $i := $collectionIndexes }}
      <a href="/status/{{ $.NarratorIndex }}/{{ $i }}">/status/{{ $.NarratorIndex }}/{{ $i }}</a><br>
    {{- end }}
  {{- end }}
`
	// template execute into buffer from
	tmpl, err := template.New("status").Parse(tmplText)
	data := struct{
		NarratorIndex int64
		CollectionIndex int64
		CollectionInfo CollectionInfo
		UpdatesIn time.Duration
		FullOutputHistory map[time.Time]string
		FullRunHistory map[time.Time]string
		AllCollectionsByStatus map[string][]int64
		Failure string
	}{
		narratorIndex,
		collectionIndex,
		collectionInfo,
		updatesIn,
		fullOutputHistory,
		fullRunHistory,
		allCollectionsByStatus,
		string(failureData),
	}

	var resBuffer bytes.Buffer

	if err = tmpl.Execute(&resBuffer, data); err != nil {
		return serverError(err)
	}

	return c.HTML(http.StatusOK, resBuffer.String())
}

func NewPubWarmer(
	p *publisher.Publisher,
	s publisher.PublisherStore,
	c *ethclient.Client,
) PubWarmer {
	return PubWarmer{p, s, c, make(map[int64]NarratorInfo)}
}

func key(a int64, b int64) string {
	return fmt.Sprintf("%v.%v", a, b)
}

// KeepWarm keeps the cache for a given narrator warm by calling
// runNarratorScript when caches become invalid, and when new
// collections are scheduled
func (pw PubWarmer) KeepWarm(narratorIndex int64) {
	narrator, err := pw.pub.GetNarrator(narratorIndex)
	if err != nil {
		log.Println("KeepWarm: ERR", err)
		return
	}

	totalCollections := narrator.TotalCollections.Int64()
	narratorInfo, _ := pw.info[narratorIndex]
	narratorInfo.totalCollections = totalCollections

	collections := make(map[int64]CollectionInfo)
	narratorInfo.collections = collections

	pw.info[narratorIndex] = narratorInfo

	var collectionIndex int64
	var currentCollection CollectionInfo
	collectionIndex = 0
	log.Println("KeepWarm: narrator", narratorIndex, "total collections", totalCollections)
	for collectionIndex < totalCollections {
		log.Println(
			"KeepWarm: running",
			key(narratorIndex, collectionIndex),
		)
		currentCollection = collections[collectionIndex]
		currentCollection.Status = Running
		now := time.Now()
		if currentCollection.StatusHistory == nil {
			currentCollection.StatusHistory = make(
				map[time.Time]CollectionStatus,
			)
		}
		currentCollection.StatusHistory[now] = Running
		collections[collectionIndex] = currentCollection
		result, output, err := pw.runNarratorScript(
			narratorIndex,
			collectionIndex,
		)
		if err != nil {
			log.Println("KeepWarm ERR:", err)
			failurePath := fmt.Sprintf(
				"/info/failure_%v.%v.json",
				narratorIndex,
				collectionIndex,
			)
			_ = os.WriteFile(failurePath, []byte(output), 0644)
			// try again in 30 minutes
			currentCollection.StatusHistory[now] = Failed
			currentCollection.Status = Failed
			log.Println(
				"Script failed\n\n",
				output,
				"\n\nWaiting 30 minutes and trying again",
			)
			time.Sleep(30 * time.Minute)
			currentCollection.StatusHistory[now] = Unknown
			currentCollection.Status = Unknown
			continue
		}

		resultPath := fmt.Sprintf(
			"/info/result_%v.%v.%v.json",
			narratorIndex,
			collectionIndex,
			now.Unix(),
		)
		resultData, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			resultData = []byte(fmt.Sprintf(
				"Error marshaling result %v",
				err,
			))
		}
		_ = os.WriteFile(resultPath, resultData, 0644)

		outputPath := fmt.Sprintf(
			"/info/output_%v.%v.%v.json",
			narratorIndex,
			collectionIndex,
			now.Unix(),
		)
		_ = os.WriteFile(outputPath, []byte(output), 0644)

		if currentCollection.ScriptResultHistory == nil {
			currentCollection.ScriptResultHistory = make(
				map[time.Time]string,
			)
		}
		currentCollection.ScriptResultHistory[now] = resultPath

		if currentCollection.ScriptOutputHistory == nil {
			currentCollection.ScriptOutputHistory = make(
				map[time.Time]string,
			)
		}
		currentCollection.ScriptOutputHistory[now] = outputPath
		collections[collectionIndex] = currentCollection

		// if that collection is finished (nextUpdateTime == -1),
		// run the next collection if there is one
		if result.NextUpdateTime == -1 {
			currentCollection.Status = Complete
			if currentCollection.StatusHistory == nil {
				currentCollection.StatusHistory = make(
					map[time.Time]CollectionStatus,
				)
			}
			currentCollection.StatusHistory[now] = Complete
			collections[collectionIndex] = currentCollection
			log.Println(
				"KeepWarm: Collection finished in the past",
				key(narratorIndex, collectionIndex),
			)
			collectionIndex += 1
			// TODO wait until the next collection starts before trying to run it
		} else {
			// if that collection is not finished, wait
			// until nextUpdateTime and run it again
			untilUpdate := time.Duration(
				result.NextUpdateTime - now.Unix(),
			) * time.Second
			log.Println(
				"KeepWarm: Collection",
				key(narratorIndex, collectionIndex),
				"updates in",
				untilUpdate.String(),
			)
			currentCollection.Status = Scheduled
			if currentCollection.StatusHistory == nil {
				currentCollection.StatusHistory = make(
					map[time.Time]CollectionStatus,
				)
			}
			currentCollection.StatusHistory[now] = Scheduled
			currentCollection.NextUpdateTime = time.Unix(
				// update the collection one second
				// after it's scheduled so we are sure
				// it should be updated... Do we
				// actually need to wait for a full
				// block to be mined though?
				result.NextUpdateTime + 1,
				0,
			)
			collections[collectionIndex] = currentCollection
			time.Sleep(untilUpdate)
		}
	}
	log.Println("KeepWarm: Done with narrator", narratorIndex)
}

func (pw PubWarmer) runNarratorScript(
	narratorIndex int64,
	collectionIndex int64,
) (publisher.ScriptResult, string, error) {
	if collectionIndex < 0 {
		return publisher.ScriptResult{}, "", errors.New("Negative collection index")
	}

	resultKey := key(narratorIndex, collectionIndex)

	prefix := fmt.Sprintf("%v pw.runNarratorScript", resultKey)
	cachedResult, err := pw.store.Get(resultKey)
	if err == nil {
		// we have it cached
		log.Println(prefix, "Cache hit!")
		return cachedResult, "", nil
	}
	log.Println(prefix, "Cache miss")

	narrator, err := pw.pub.GetNarrator(narratorIndex)
	if err != nil {
		log.Println(prefix, "could not get narrator", err)
		return publisher.ScriptResult{}, "", err
	}

	collectionStart := narrator.Start.Int64() +
		(collectionIndex * narrator.CollectionSpacing.Int64())

	script, err := pw.pub.GetScript(narratorIndex, pw.client)
	if err != nil {
		log.Println(prefix, "could not get script", err)
		return publisher.ScriptResult{}, "", err
	}

	var previousResult publisher.ScriptResult
	var output string
	if collectionIndex == 0 {
		previousResult = publisher.ScriptResult{}
	} else {
		log.Println(key(narratorIndex, collectionIndex), "getting previous result")
		// recurse
		previousResult, output, err = pw.runNarratorScript(
			narratorIndex,
			collectionIndex - 1,
		)
		if err != nil {
			log.Println(
				prefix,
				"could not get previous result",
				err,
			)
			return publisher.ScriptResult{}, output, err
		}
	}

	result, output, err := pw.pub.RunNarratorScript(
		script,
		previousResult,
		collectionStart,
		narrator.CollectionLength.Int64(),
		narrator.CollectionSize.Int64(),
	)
	if err != nil {
		log.Println(
			key(narratorIndex, collectionIndex),
			"could not get result",
			err,
		)
		return publisher.ScriptResult{}, output, err
	}

	if err := pw.store.Set(
		key(narratorIndex, collectionIndex),
		result,
	); err != nil {
		log.Println(prefix, "WARNING: Could not cache result:", err)
	}

	return result, output, nil
}
