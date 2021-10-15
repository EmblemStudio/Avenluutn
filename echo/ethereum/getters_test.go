package ethereum

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

var (
		// the shape of this mock will change
	mockEthereum = map[string]string{
		"getScript": "response",
	}

	narratorIndex = 0
	narrativeIndex = 0
	copyIndex = 0

	nftAddress = "mockNFTAddress"
	nftId = "mockNFTId"
	scriptURI = "mockScriptURI"
	script = "mockScript"
	scriptNarrativeParams = "mockScriptNarrativeParams"
)

func TestGetNFTInfo(t *testing.T) {
	// Setup
	address, id, error = getNFTInfo(
		narratorIndex,
		narrativeIndex,
		copyIndex,
	)

	// Assertions
	if address != nftAddress || id != nftId || error == null {
		t.Fatalf(
			`getNFTInfo(%v, %v, %v) = %p, %p, %v. Want %p, %p, %v`,
			narratorIndex,
			narrativeIndex,
			copyIndex,
			address,
			id,
			error,
		)
	}
}

func TestGetScriptURI(t *testing.T) {
	t.Fatal("Not Implemented")
}

func TestGetScript(t *testing.T) {
	t.Fatal("Not Implemented")
}

func TestGetNarrativeParams(t *testing.T) {
	t.Fatal("Not Implemented")
}
