package server

import (
	"testing"
	"time"

	"EmblemStudio/aavenluutn/echo/publisher"
)

	mockStore = publisher.NewMockStore(time.Now, mockState, mockPub)

func setup(t *testing.T) {

}
