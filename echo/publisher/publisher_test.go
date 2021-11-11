package publisher

import (
//	"fmt"
	"math/big"
	"testing"
	"os"
	"time"
	"reflect"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func GetContractAddrs() (common.Address, common.Address, error) {
	var (
		pubAddrPath = "../../hardhat/PublisherAddress.txt"
		nftAddrPath = "../../hardhat/NarratorNFTsAddress.txt"
	)
	publisherAddressData, err := os.ReadFile(pubAddrPath)
	if err != nil {
		return common.Address{}, common.Address{}, err
	}
	nftAddressData, err := os.ReadFile(nftAddrPath)
	if err != nil {
		return common.Address{}, common.Address{}, err
	}
	publisherAddress := common.HexToAddress(string(publisherAddressData))
	nftAddress := common.HexToAddress(string(nftAddressData))
	return publisherAddress, nftAddress, nil
}

func EthSetup(t *testing.T) (
	*Publisher,
	common.Address,
	*NarratorNFTs,
	common.Address,
	*ethclient.Client,
) {
	publisherAddress, nftAddress, err := GetContractAddrs()
	if err != nil {
		t.Fatalf("Could not get contract addresses: %v", err)
	}

	client, err := ethclient.Dial("http://localhost:8545")
	if err != nil {
		t.Fatalf("Setup could not connect to test chain: %v", err)
	}

	pub, err := NewPublisher(publisherAddress, client)
	if err != nil {
		t.Fatalf("Setup could not connect to publisher contract: %v", err)
	}

	nfts, err := NewNarratorNFTs(nftAddress, client)
	if err != nil {
		t.Fatalf("Setup could not connect to NFT contract: %v", err)
	}

	return pub, publisherAddress, nfts, nftAddress, client
}

func TestGetNarrator(t *testing.T) {

	// Setup
	var narratorIndex int64 = 0
	pub, _, _, nftAddress, _ := EthSetup(t)

	expectedNarrator := PublisherNarrator{
		nftAddress,
		big.NewInt(0),
		big.NewInt(1), // start
		big.NewInt(10), // totalCollections
		big.NewInt(100), // collectionLength
		big.NewInt(1_000), // collectionSpacing
		big.NewInt(10_000), // collectionSize
	}

	// Run SUT
	narrator, err := pub.GetNarrator(narratorIndex)

	// Assertions
	if err != nil {
		t.Errorf(
			"\nhave: GetNarrator(%v) => _, %v\nwant: _, <nil>",
			narratorIndex,
			err,
		)
	}

	if narrator.NFTAddress != expectedNarrator.NFTAddress {
		t.Errorf(
			"\nhave: NFTAddress = %v\nwant: NFTAddress = %v",
			narrator.NFTAddress,
			expectedNarrator.NFTAddress,
		)
	}

	if narrator.NFTId.Cmp(expectedNarrator.NFTId) != 0 {
		t.Errorf(
			"\nhave: NFTId = %v\nwant: NFTId = %v",
			narrator.NFTId,
			expectedNarrator.NFTId,
		)
	}

	if narrator.Start.Cmp(expectedNarrator.Start) != 0 {
		t.Errorf(
			"\nhave: Start = %v\nwant: Start = %v",
			narrator.Start,
			expectedNarrator.Start,
		)
	}

	if narrator.TotalCollections.Cmp(expectedNarrator.TotalCollections) != 0 {
		t.Errorf(
			"\nhave: TotalCollections = %v\nwant: TotalCollections = %v",
			narrator.TotalCollections,
			expectedNarrator.TotalCollections,
		)
	}

	if narrator.CollectionLength.Cmp(expectedNarrator.CollectionLength) != 0 {
		t.Errorf(
			"\nhave: CollectionLength = %v\nwant: CollectionLength = %v",
			narrator.CollectionLength,
			expectedNarrator.CollectionLength,
		)
	}

	if narrator.CollectionSpacing.Cmp(expectedNarrator.CollectionSpacing) != 0 {
		t.Errorf(
			"\nhave: CollectionSpacing = %v\nwant: CollectionSpacing = %v",
			narrator.CollectionSpacing,
			expectedNarrator.CollectionSpacing,
		)
	}

	if narrator.CollectionSize.Cmp(expectedNarrator.CollectionSize) != 0 {
		t.Errorf(
			"\nhave: CollectionSize = %v\nwant: CollectionSize = %v",
			narrator.CollectionSize,
			expectedNarrator.CollectionSize,
		)
	}


}

func TestGetScriptURI(t *testing.T) {
	var expectedScriptURI string = "data:text/javascript;base64,YXN5bmMgZnVuY3Rpb24gdGVsbFN0b3JpZXMocmVzdWx0LCBhLCBiLCBjLCBkKSB7CiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7CiAgICAgICAgbGV0IHN0YXRlID0geyBob3dXZVdlcmU6ICAiY3VyaW91cyJ9CiAgICAgICAgcmVzdWx0ID0geyBuZXh0U3RhdGU6IHN0YXRlLCBzdG9yaWVzOiBbXSB9CiAgICB9CiAgICByZXR1cm4gewogICAgICAgIG5leHRTdGF0ZTogT2JqZWN0LmFzc2lnbihyZXN1bHQubmV4dFN0YXRlLCB7YTogYX0pLAogICAgICAgIHN0b3JpZXM6IFtgV2Ugd2VyZSAke3Jlc3VsdC5uZXh0U3RhdGUuaG93V2VXZXJlfS5gXQogIH0KfQoKbW9kdWxlLmV4cG9ydHMgPSB7IHRlbGxTdG9yaWVzIH0="

	pub, _, _, _, client := EthSetup(t)

	scriptURI, err := pub.GetScriptURI(0, client)
	if err != nil {
		t.Fatalf("Could not get script: %v", err)
	}

	if scriptURI.String() != expectedScriptURI {
		t.Errorf("\nwant: %v\nhave: %v", expectedScriptURI, scriptURI)
	}
}

func TestGetCachedResult(t *testing.T) {
	pub, _, _, _, _ := EthSetup(t)

	testPubStore := &MockStore{
		time.Unix(15, 0),
		map[string]ScriptResult{
			"0.0.10": ScriptResult{
				Stories: []Story{"a", "b"},
				NextState: map[string]interface{}{},
			},
		},
		pub,
	}

	// While we are here let's test our test method for latest block time
	wantTime := time.Unix(10, 0)
	haveTime, err := testPubStore.LatestBlockTimeAsOf(testPubStore.Now())
	if err != nil {
		t.Fatalf("could not get mock latest block time:\n%v", err)
	}
	if wantTime != haveTime {
		t.Fatalf(
			"Wrong latest block time.\nhave: %v\nwant: %v",
			haveTime,
			wantTime,
		)
	}

	// so we want the state to be the one at key 0.0.0.10
	wantState, ok := testPubStore.state["0.0.10"]
	if !ok {
		t.Fatal("could not read expected state")
	}
	haveState, err := GetCachedResult(testPubStore, 0, 0, time.Unix(10, 0))
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if !reflect.DeepEqual(haveState, wantState) {
		t.Errorf(
			"GetState(0, 0, 0)\nhave: %v, _\nwant: %v, _",
			haveState,
			wantState,
		)
	}
}

func TestGetStoryFirstCall(t *testing.T) {
	pub, _, _, _, client := EthSetup(t)
	testPubStore := &MockStore{
		time.Unix(95, 0), // five seconds after the highest block
		map[string]ScriptResult{},
		pub,
	}

	haveStory, err := pub.GetStory(client, testPubStore, 0, 0, 0)

	wantStory := "We were curious."
	if haveStory != wantStory || err != nil {
		t.Errorf(
			"GetStory\nwant: %v, %v\nhave: %v, %v",
			wantStory,
			nil,
			haveStory,
			err,
		)
	}
}

func TestGetStory(t *testing.T) {
	pub, _, _, _, client := EthSetup(t)

	testPubStore := &MockStore{
		time.Unix(15, 0),
		map[string]ScriptResult{
			"0.0.10": ScriptResult{
				Stories: []Story{"a", "b"},
				NextState: map[string]interface{}{
					"next": "state",
					"howWeWere": "well",
				},
			},
		},
		pub,
	}

	wantStory := "We were well."
	haveStory, err := pub.GetStory(client, testPubStore, 0, 0, 0); if err != nil {
		t.Fatalf("Could not get Story: %v", err)
	}
	if haveStory != wantStory {
		t.Errorf(
			"GetStory(...)\nhave: %v\nwant: %v",
			haveStory,
			wantStory,
		)
	}

	// after the next block we should be able to get the next state
	// which should have been put there by getting the story

	/** the test script at narrator 0

function tellStory(state, a, b, c, d) {
if (!state.howWeWere) {
        state.howWeWere = "curious"
    }
    return {
        nextState: Object.assign(state, {a: a}),
        stories: [`We were ${state.howWeWere}.`]
  }
}
         */

	testPubStore.setTime(time.Unix(25, 0))
	pub.GetStory(client, testPubStore, 0, 0, 0)
	haveResult, err := GetCachedResult(testPubStore, 0, 0, time.Unix(20, 0))
	wantNextState := map[string]interface{}{
		"howWeWere": "well",
		"a": float64(1),
		"next": "state",
	}
	if !reflect.DeepEqual(wantNextState, haveResult.NextState) {
		t.Errorf(
			"Next state:\nhave: %v\nwant: %v",
			haveResult.NextState,
			wantNextState,
		)
	}
}
