package publisher

import (
	"testing"
	"reflect"
	"os"
)

func TestEthLocalStore(t *testing.T) {
	// set up
	localFolder := "./tmp-test-store"
	os.Mkdir(localFolder, 0755)
	localStore := NewEthLocalStore(localFolder, "localhost:8545")
	wantResult := ScriptResult{
		Stories: []Story{ "story a", "story b" },
		NextState: map[string]interface{}{
			"a": float64(1),
			"b": float64(2),
		},
	}
	key := "testKey"


	// Run SUT
	_, err := localStore.Get(key)
	if err == nil {
		t.Errorf("\nwant non-nil error,\nhave %v", err)
	}

	setErr := localStore.Set(key, wantResult)
	if setErr != nil {
		t.Errorf("\nwant <nil>\nhave %v", setErr)
	}
	haveResult, err := localStore.Get(key)
	if !reflect.DeepEqual(haveResult, wantResult) || err != nil {
		t.Errorf(
			"\nwant %v, <nil>\nhave %v, %v",
			wantResult,
			haveResult,
			err,
		)
	}

	// Clean up
	os.RemoveAll(localFolder)
}
