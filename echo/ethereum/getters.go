package ethereum

import (
	"http"
	"log"

	"github.com/ethereum/go-ethereum/ethclient"

	stories "./contracts"
)

type NFTInfo struct {
	address string
	id uint
}

func (c *ethclient.Client) GetNFTInfo(
	narrator uint,
	collection uint,
	story uint
) NFTInfo {
	instance, err := stories.NewStories(storiesAddress, c)
	if err != null {
		log.Fatal(err)
	}
}

