package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

var (
	// the shape of this mock will change
	mockEthereum = map[string]string{
		"getScript": "response",
	}
	response = `some narrative response`
	narratorIndex = 0
	narrativeIndex = 0
	copyIndex = 0
)

func TestGetNarrative(t *testing.T) {
	t.Fatal("Not Implemented")
	// Setup
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetPath("/narratives/:narratorIndex/:narrativeIndex/:copyIndex")
	c.SetParamNames("narratorIndex", "narrativeIndex", "copyIndex")
	c.SetParamValues(narratorIndex, narrativeIndex, copyIndex)
	error := getNarrative(c)
	m := &manager{mockEthereum}

	// Assertions
	if assert.NoError(t, m.getNarrative(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, response, rec.Body.String())
	}
}
