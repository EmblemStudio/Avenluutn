package main

import (
	"log"
	"net/http"
	"os"
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"EmblemStudio/aavenluutn/echo/publisher"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/common"

	"EmblemStudio/aavenluutn/echo/server"
)

var (
	// TODO move global vars to config
	pubHexAddress = "0x0533770ca8Fe4fDb4C186aE00363fbFdEEf34efb"
	provider      = "https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8"
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

	// make a server
	client, err := ethclient.Dial(provider)
	if err != nil {
		log.Fatal(err)
	}
	pubAddress := common.HexToAddress(pubHexAddress)
	pub, err := publisher.NewPublisher(pubAddress, client)
	if err != nil {
		log.Fatal(err)
	}
	pubStore := publisher.NewEthLocalStore("/store", client)
	s := server.NewPubServer(pub, pubStore, client)

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/runs/:narrator/:collection", s.RunNarratorScript)

	e.GET("/stories/:narrator/:collection/:story", s.GetStory)

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

	e.Static("/test", "static")

	e.POST("/test/script", s.RunTestScript)

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
