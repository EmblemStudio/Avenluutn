package main

import (
	"log"
	"net/http"
	"os"
	"fmt"
	"time"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"EmblemStudio/aavenluutn/echo/publisher"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/common"

	"EmblemStudio/aavenluutn/echo/warmer"
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

	runAllNarrators := os.Getenv("AVENLUUTN_RUN_ALL_NARRATORS")
	fmt.Println("Run all narrators (default 'false')", runAllNarrators)

	// make a warmer
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
	w := warmer.NewPubWarmer(pub, pubStore, client)

	e := echo.New()

	narratorCount, err := pub.NarratorCount(nil)
	if err != nil { log.Fatal(err) }
	firstNarrator := 0
	if runAllNarrators == "" || strings.ToLower(runAllNarrators) == "false" {
		// default, don't run all narrators
		firstNarrator = int(narratorCount.Int64() - 1)
	}
	warming := make(map[int]bool)
	for n := firstNarrator; int64(n) < narratorCount.Int64(); n += 1 {
		go w.KeepWarm(int64(n))
		warming[n] = true
	}

	errorCount := 0
	errorThreshold := 10
	go func() {
		for {
			time.Sleep(30 * time.Second)
			narratorCount, err := pub.NarratorCount(nil)
			if err != nil {
				fmt.Println("Could not get narator count.", err)
				errorCount += 1
				if errorCount > errorThreshold {
					fmt.Println("too many errors, stopping looking for new narrators")
					return
				}
			} else {
				errorCount = 0
				for n := firstNarrator; int64(n) < narratorCount.Int64(); n += 1 {
					if !warming[n] {
						go w.KeepWarm(int64(n))
					}
					warming[n] = true
				}
			}
		}
	}()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("/status/:narrator/:collection", w.GetCollectionInfo)

	e.GET("/settings", func(c echo.Context) error {
		return c.HTML(
			http.StatusOK,
			fmt.Sprintf(
				"Warmer\nPublisher address: %v\nProvider URL: %v",
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

	httpPort := os.Getenv("WARMER_HTTP_PORT")
	if httpPort == "" {
		httpPort = "8000"
	}

	e.Logger.Fatal(e.Start(":" + httpPort))
}
