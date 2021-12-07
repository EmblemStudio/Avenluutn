package publisher

import (
	"testing"
	"reflect"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
)

var ropsten = "https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8"
var localFolder = "./tmp-test-store"

func setUp(t *testing.T) (*EthLocalStore, *ethclient.Client) {
	os.Mkdir(localFolder, 0755)
	client, err := ethclient.Dial(ropsten)
	if err != nil {
		t.Fatalf("could not create Ethereum client")
		return &EthLocalStore{}, client
	}
	localStore := NewEthLocalStore(localFolder, client)
	return localStore, client
}

func tearDown(_ *testing.T) error {
	return os.RemoveAll(localFolder)
}

func TestEthLocalStoreTime(t *testing.T) {
	// set up
	localStore, client := setUp(t)
	defer tearDown(t)
	t.Log(localStore, client)

	// run SUT
	target := int64(1533553279) // an earlyish Ropsten block time
	onTarget := time.Unix(target, 0)

	// when it's spot on
	haveNext, err := localStore.NextBlockTimeAsOf(onTarget)
	if err != nil {
		t.Fatalf("could not get next block time\n%v", err)
	}

	haveLatest, err := localStore.LatestBlockTimeAsOf(onTarget)
	if err != nil {
		t.Fatalf("could not get latest block time\n%v", err)
	}

	if haveLatest != onTarget || haveNext != onTarget {
		t.Errorf(
			"\nwant l and n to equal target\nhave l(%v) || n(%v) != %v",
			haveLatest,
			haveNext,
			onTarget,
		)
	}

	// before and after should get the same target (onTarget)
	beforeTarget := time.Unix(target - 1, 0)
	afterTarget := time.Unix(target + 1, 0)

	haveNext, err = localStore.NextBlockTimeAsOf(beforeTarget)
	if err != nil {
		t.Fatalf("could not get next block time\n%v", err)
	}

	haveLatest, err = localStore.LatestBlockTimeAsOf(afterTarget)
	if err != nil {
		t.Fatalf("could not get latest block time\n%v", err)
	}

	if haveLatest != onTarget || haveNext != onTarget {
		t.Errorf(
			"\nwant l and n to get to same target\nhave l(%v) || n(%v) != %v",
			haveLatest,
			haveNext,
			onTarget,
		)
	}

	// what about for times after the latest block (like Now!)
	haveNextNow, err := localStore.NextBlockTimeAsOf(time.Now())
	if err == nil {
		t.Errorf("\nwant _, non nil,\nhave: %v, %v", haveNextNow, err)
	}

	haveLatestNow, err := localStore.LatestBlockTimeAsOf(time.Now())
	if err != nil {
		t.Errorf(
			"LatestBlockTimeAsOf(Now)\nwant _, <nil>\nhave: %v, %v",
			haveLatestNow,
			err,
		)
	}
}

func TestEthLocalStore(t *testing.T) {
	// set up
	localStore, _ := setUp(t)
	defer tearDown(t)
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

	err = localStore.Set(key, wantResult, time.Now().Add(time.Minute))
	if err != nil {
		t.Errorf("\nwant <nil>\nhave %v", err)
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
}
