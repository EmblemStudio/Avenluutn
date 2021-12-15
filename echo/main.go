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

func main() {

	pubHexAddress := os.Getenv("AVENLUUTN_PUB_ADDR")
	if pubHexAddress == "" {
		log.Fatal("Missing required AVENLUUTN_PUB_ADDR envar")
	}
	fmt.Println("Publisher address", pubHexAddress)

	provider := os.Getenv("AVENLUUTN_PROVIDER")
	if provider == "" {
		log.Fatal("Missing required AVENLUUTN_PROVIDER envar")
	}
	fmt.Println("Provider", provider)

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

	narratorCount, err := pub.NarratorCount(nil)
	if err != nil { log.Fatal(err) }
	for n := 0; int64(n) < narratorCount.Int64(); n += 1 {
		go s.KeepWarm(int64(n))
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.Static("/runs/", "store")

	e.Static("/", "ui")

	e.GET("/settings", func(c echo.Context) error {
		return c.HTML(
			http.StatusOK,
			fmt.Sprintf(
				"Publisher address: %v\nProvider URL: %v",
				pubHexAddress,
				provider,
			),
		)
	})

	e.Static("/test", "testAssets")

	e.GET("/healthcheck", func(c echo.Context) error {
		return c.JSON(
			http.StatusOK,
			struct{ Status string }{ Status: "OK" },
		)
	})

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		httpPort = "8000"
	}

	e.Logger.Fatal(e.Start(":" + httpPort))
}
