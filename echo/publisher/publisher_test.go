
package publisher

import (
	"fmt"
	"math/big"
	"testing"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func GetContractAddrs() (common.Address, common.Address, error) {
	var (
		pubAddrPath = "../../hardhat/PublisherAddress.txt"
		nftAddrPath = "../../hardhat/NarratorNFTsAddress.txt"
	)
	publisherAddressData, err := os.ReadFile(pubAddrPath)
	if err != nil {
		return common.Address{}, common.Address{}, err
	}
	nftAddressData, err := os.ReadFile(nftAddrPath)
	if err != nil {
		return common.Address{}, common.Address{}, err
	}
	publisherAddress := common.HexToAddress(string(publisherAddressData))
	nftAddress := common.HexToAddress(string(nftAddressData))
	return publisherAddress, nftAddress, nil
}

func EthSetup(t *testing.T) (
	*Publisher,
	common.Address,
	*NarratorNFTs,
	common.Address,
	*ethclient.Client,
) {
	publisherAddress, nftAddress, err := GetContractAddrs()
	if err != nil {
		t.Fatalf("Could not get contract addresses: %v", err)
	}

	client, err := ethclient.Dial("http://localhost:8545")
	if err != nil {
		t.Fatalf("Setup could not connect to test chain: %v", err)
	}

	pub, err := NewPublisher(publisherAddress, client)
	if err != nil {
		t.Fatalf("Setup could not connect to publisher contract: %v", err)
	}

	nfts, err := NewNarratorNFTs(nftAddress, client)
	if err != nil {
		t.Fatalf("Setup could not connect to NFT contract: %v", err)
	}

	return pub, publisherAddress, nfts, nftAddress, client
}

func skipTestGetNarrator(t *testing.T) {

	// Setup
	var narratorIndex int64 = 0
	pub, _, _, nftAddress, _ := EthSetup(t)

	fmt.Println(nftAddress)
	expectedNarrator := PublisherNarrator{
		nftAddress,
		big.NewInt(0),
		big.NewInt(1), // start
		big.NewInt(10), // totalCollections
		big.NewInt(100), // collectionLength
		big.NewInt(1_000), // collectionSpacing
		big.NewInt(10_000), // collectionSize
	}

	// Run SUT
	narrator, err := pub.GetNarrator(narratorIndex)

	// Assertions
	if err != nil {
		t.Errorf(
			"\nhave: GetNarrator(%v) => _, %v\nwant: _, <nil>",
			narratorIndex,
			err,
		)
	}

	if narrator.NFTAddress != expectedNarrator.NFTAddress {
		t.Errorf(
			"\nhave: NFTAddress = %v\nwant: NFTAddress = %v",
			narrator.NFTAddress,
			expectedNarrator.NFTAddress,
		)
	}

	if narrator.NFTId.Cmp(expectedNarrator.NFTId) != 0 {
		t.Errorf(
			"\nhave: NFTId = %v\nwant: NFTId = %v",
			narrator.NFTId,
			expectedNarrator.NFTId,
		)
	}

	if narrator.Start.Cmp(expectedNarrator.Start) != 0 {
		t.Errorf(
			"\nhave: Start = %v\nwant: Start = %v",
			narrator.Start,
			expectedNarrator.Start,
		)
	}

	if narrator.TotalCollections.Cmp(expectedNarrator.TotalCollections) != 0 {
		t.Errorf(
			"\nhave: TotalCollections = %v\nwant: TotalCollections = %v",
			narrator.TotalCollections,
			expectedNarrator.TotalCollections,
		)
	}

	if narrator.CollectionLength.Cmp(expectedNarrator.CollectionLength) != 0 {
		t.Errorf(
			"\nhave: CollectionLength = %v\nwant: CollectionLength = %v",
			narrator.CollectionLength,
			expectedNarrator.CollectionLength,
		)
	}

	if narrator.CollectionSpacing.Cmp(expectedNarrator.CollectionSpacing) != 0 {
		t.Errorf(
			"\nhave: CollectionSpacing = %v\nwant: CollectionSpacing = %v",
			narrator.CollectionSpacing,
			expectedNarrator.CollectionSpacing,
		)
	}

	if narrator.CollectionSize.Cmp(expectedNarrator.CollectionSize) != 0 {
		t.Errorf(
			"\nhave: CollectionSize = %v\nwant: CollectionSize = %v",
			narrator.CollectionSize,
			expectedNarrator.CollectionSize,
		)
	}


}

func TestGetScriptURI(t *testing.T) {
	var expectedScriptURI string = "data:text/javascript;base64,YXN5bmMgZnVuY3Rpb24gdGVsbFN0b3JpZXMocmVzdWx0LCBhLCBiLCBjLCBkKSB7CiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7CiAgICAgICAgbGV0IHN0YXRlID0geyBob3dXZVdlcmU6ICAiY3VyaW91cyJ9CiAgICAgICAgcmVzdWx0ID0geyBuZXh0U3RhdGU6IHN0YXRlLCBzdG9yaWVzOiBbXSB9CiAgICB9CiAgICByZXR1cm4gewogICAgICAgIG5leHRTdGF0ZTogT2JqZWN0LmFzc2lnbihyZXN1bHQubmV4dFN0YXRlLCB7YTogYX0pLAogICAgICAgIHN0b3JpZXM6IFtgV2Ugd2VyZSAke3Jlc3VsdC5uZXh0U3RhdGUuaG93V2VXZXJlfS5gXQogIH0KfQoKbW9kdWxlLmV4cG9ydHMgPSB7IHRlbGxTdG9yaWVzIH0="

	pub, _, _, _, client := EthSetup(t)

	scriptURI, err := pub.GetScriptURI(0, client)
	if err != nil {
		t.Fatalf("Could not get script: %v", err)
	}

	if scriptURI.String() != expectedScriptURI {
		t.Errorf("\nwant: %v\nhave: %v", expectedScriptURI, scriptURI)
	}
}

func TestRunNarratorScript(t *testing.T) {
	t.Errorf("Not Implemented")
}
