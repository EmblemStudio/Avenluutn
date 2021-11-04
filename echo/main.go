package main

import (
	"log"
	"net/http"
	"os"
	"fmt"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"EmblemStudio/aavenluutn/echo/publisher"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/common"
)

var (
	// TODO move global vars to config
	pubHexAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
	provider      = "http://localhost:8545"
	//"https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8"
)

/*

REST Endpoints

/healthcheck
    return 200 ok

/
    return some help text and settings

/<narrator>/<collection>/<story>
    return the text for this story

*/

func main() {

	// make a new publisher
	client, err := ethclient.Dial(provider)
	if err != nil {
		log.Fatal(err)
	}
	pubAddress := common.HexToAddress(pubHexAddress)
	pub, err := publisher.NewPublisher(pubAddress, client)
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	pubStore := publisher.NewEthLocalStore("/store", client)

	e.GET("/:narrator/:collection/:story", func(c echo.Context) error {
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
		fmt.Println("--> Getting Story", narratorIndex, collectionIndex, storyIndex)
		story, err := pub.GetStory(
			client,
			pubStore,
			narratorIndex,
			collectionIndex,
			storyIndex,
		)
		if err != nil {
			fmt.Println("-->", err)
			return echo.NewHTTPError(
				http.StatusInternalServerError,
				err,
			)
		}
		return c.String(http.StatusOK, fmt.Sprintf("%v", story))
	})

	e.GET("/", func(c echo.Context) error {
		return c.HTML(
			http.StatusOK,
			fmt.Sprintf(
				"Publisher address: %v\nProvider URL: %v",
				pubHexAddress,
				provider,
			),
		)
	})

	e.GET("/healthcheck", func(c echo.Context) error {
		return c.JSON(
			http.StatusOK,
			struct{ Status string }{Status: "OK"},
		)
	})

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		httpPort = "8000"
	}

	e.Logger.Fatal(e.Start(":" + httpPort))
}
