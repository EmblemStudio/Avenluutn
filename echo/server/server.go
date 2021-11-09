package server

import (
	"strconv"
	"net/http"
	"fmt"

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

func (ps PubServer) GetStory(c echo.Context) error {
	narratorParam := c.Param("narrator")
	narratorIndex, err := strconv.ParseInt(narratorParam, 10, 64)
	if err != nil {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			err,
		)
	}
	collectionParam := c.Param("collection")
	collectionIndex, err := strconv.ParseInt(collectionParam, 10, 64)
	if err != nil {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			err,
		)
	}
	storyParam := c.Param("story")
	storyIndex, err := strconv.ParseInt(storyParam, 10, 64)
	if err != nil {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			err,
		)
	}

	story, err := ps.pub.GetStory(
		ps.client,
		ps.store,
		narratorIndex,
		collectionIndex,
		storyIndex,
	)
	if err != nil {
		return echo.NewHTTPError(
			http.StatusInternalServerError,
			err,
		)
	}
	return c.String(http.StatusOK, fmt.Sprintf("%v", story))
}


