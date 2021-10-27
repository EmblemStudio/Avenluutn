package main

import (
	"log"
	"net/http"
	"os"
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"EmblemStudio/aavenluutn/echo/publisher"
)

var (
	// TODO move global vars to config
	pubHexAddress = "0x0"
	network       = "localhost:8545"
)

func main() {

	// make a new publisher
	network := "localhost:8545"
	conn, err := ethclient.Dial(network)
	if err != nil {
		log.Fatal(err)
	}
	pubAddress := common.HexToAddress(pubHexAddress)
	pub, err := publisher.NewPublisher(pubAddress, conn)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(pub)

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, "Help text not written")
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
