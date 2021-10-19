package ethereum

import (
	"http"
	"log"

	"github.com/ethereum/go-ethereum/ethclient"

	publisher "./contracts"
)

type NftInfo struct {
	address string
	id uint
}

func (c *ethclient.Client) GetNftInfo(
	narrator uint,
	collection uint,
	story uint
) NftInfo {
	instance, err := publisher.NewPublisher(config.publisherAddress, c)
	if err != null {
		log.Fatal(err)
	}
}

