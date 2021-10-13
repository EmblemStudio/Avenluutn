//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NarrativeManager is ReentrancyGuard, Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;

    /**
     * Narrators are represented by an NFT. They have a hash of the
     * code, a link to the code and maybe some metadata. The script
     * generates content by reading blocks between the start and end
     * using them as seeds for generation.
     */
    struct Narrator {
        address NFTAddress;
        uint256 NFTId;
        uint256 start; // when this narrator becomes active
        uint256 totalNarratives; // How many narrations before it's inactive
        uint256 narrativeLength; // seconds between narration start and end
        uint256 narrativeSpacing; // seconds between narration starts
        uint256 copies; // number of simultanious narrations
    }

    struct Narrative {
        uint256 narratorIndex; // the Nth arrator ever
        uint256 index; // the Nth narrative of this narrator
        uint256 copyIndex; // the Nth copy of this narrative
        Auction auction;
    }

    // Hash of the narrativeId to Narrative
    mapping(bytes32 => Narrative) public narratives;

    Counters.Counter public nftIds;

    // We use a mapping so we get zero narrators for new indexes
    mapping(uint256 => Narrator) public narrators;
    Counters.Counter public narratorCount;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The initial duration of auctions
    uint256 public baseAuctionDuration;

    // The minimum percentage difference between the last and current bid
    uint8 public minBidIncrementPercentage;

    // The minimum bid amount
    uint256 minBidAmount;

    struct Auction {
        // The current highest bid amount
        uint256 amount;

        // The address of the current highest bid
        address payable bidder;

        // The duration of this auction
        uint256 duration;
    }

    // nftId -> narrativeId
    mapping(uint256 => bytes32) public mintedNarratives;

    constructor(
        uint256 _timeBuffer, // min time with no bids to end an auction
        uint256 _baseAuctionDuration, // min auction time
        uint256 _minBidAmount,
        uint8 _minBidIncrementPercentage,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        timeBuffer = _timeBuffer;
        baseAuctionDuration = _baseAuctionDuration;
        minBidAmount = _minBidAmount;
        minBidIncrementPercentage = _minBidIncrementPercentage;
    }

    event NarratorAdded (Narrator narrator, uint256 count);

    function addNarrator(
        address NFTAddress,
        uint256 NFTId,
        uint256 start, // when this narrator becomes active
        uint256 totalNarratives, // How many narrations before it's inactive
        uint256 narrativeLength, // seconds between narration start and end
        uint256 narrativeSpacing, // seconds between narration starts
        uint256 copies // number of simultanious narrations
    ) public onlyOwner {
        // TODO check that NFT exists
        // TODO check that nftAddress implements ERC721
        require(
                totalNarratives > 0,
                "totalNarratives must be greater than 0"
        );
        require(
                copies > 0,
                "copies must be greater than 0"
                );
        require(
                narrativeSpacing > 0,
                "narrativeSpacing must be greater than 0"
                );

        Narrator storage narrator = narrators[narratorCount.current()];
        narrator.NFTAddress = NFTAddress;
        narrator.NFTId = NFTId;
        narrator.start = start;
        narrator.totalNarratives = totalNarratives;
        narrator.narrativeLength = narrativeLength;
        narrator.narrativeSpacing = narrativeSpacing;
        narrator.copies = copies;

        emit NarratorAdded(narrator, narratorCount.current());
        narratorCount.increment(); // :o
    }

    // narrativeStartTime requires narrative to exist and will revert otherwise
    function narrativeStartTime(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex
    ) public view returns (uint256) {
        require(
            narratorIndex < narratorCount.current(),
            "NarrativeManager: Invalid Narrator"
        );
        Narrator memory narrator = narrators[narratorIndex];
        require(
            narrativeIndex < narrator.totalNarratives,
            "NarrativeManager: Invalid narrativeIndex"
        );
        require(copyIndex < narrator.copies, "NarrativeManager: Invalid copy");
        uint256 start = narrativeIndex * narrator.narrativeSpacing + narrator.start;
        return start;
    }

    function _auctionTimeLeft(bytes32 narrativeId) internal view returns (uint256) {
        // returns max uint256 if the auction is not open, and time left if it is
        Narrative memory narrative = narratives[narrativeId];
        uint256 narrativeStart = narrativeStartTime(
            narrative.narratorIndex,
            narrative.index,
            narrative.copyIndex
        );
        Narrator memory narrator = narrators[narrative.narratorIndex];
        uint256 auctionStart = narrativeStart + narrator.narrativeLength;
        if (block.timestamp < auctionStart) {
            return type(uint256).max; // Narrative hasn't ended yet, auction not open
        }
        uint256 auctionEnd = auctionStart + narrative.auction.duration;
        if (block.timestamp > auctionEnd) {
            return 0; // Auction has ended
        }
        return auctionEnd - block.timestamp;
    }

    function getNarrativeId(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(narratorIndex, narrativeIndex, copyIndex));
    }

    event Bid(bytes32 narrativeId, uint256 amount, address bidder);
    event AuctionExtended(bytes32 narrativeId, uint256 newDuration);

    function bid(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex,
        address mintTo
    ) nonReentrant external payable {
        require(mintTo != address(0), "Invalid mintTo address");
        require(msg.value >= minBidAmount, "Bid below minimum bid amount");

        bytes32 narrativeId = getNarrativeId(narratorIndex, narrativeIndex, copyIndex);
        Narrative storage narrative = narratives[narrativeId];

        // initialize the narrative and auction if needed
        if (narrative.auction.bidder == address(0)) {
            narrative.narratorIndex = narratorIndex;
            narrative.index = narrativeIndex;
            narrative.copyIndex = copyIndex;
            narrative.auction.amount = msg.value;
            narrative.auction.bidder = payable(msg.sender);
            narrative.auction.duration = baseAuctionDuration;
        } else {
            uint256 minIncrement = (
                narrative.auction.amount * minBidIncrementPercentage
            ) / 100;
            require(
                msg.value >= narrative.auction.amount + minIncrement,
                "Bid increment too low"
            );
        }
        uint256 timeLeft = _auctionTimeLeft(narrativeId);
        require(timeLeft > 0 && timeLeft < type(uint256).max, "Auction not open");
        // TODO implement WETH backup transfer

        // extend the auction if needed
        if (timeLeft < timeBuffer) {
            narrative.auction.duration += (timeBuffer - timeLeft);
            emit AuctionExtended(narrativeId, narrative.auction.duration);
        }

        // set current bidder as winning bidder
        narrative.auction.bidder = payable(msg.sender);
        narrative.auction.amount = msg.value;
        emit Bid(narrativeId, msg.value, msg.sender);

        // return previous bidder their bid
        (bool success,) = narrative.auction.bidder.call{
            value: narrative.auction.amount
        }(new bytes(0));
    }

    function mint(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex,
        address to
    ) nonReentrant public {
        require(to != address(0), "Invalid to address");
        bytes32 narrativeId = getNarrativeId(narratorIndex, narrativeIndex, copyIndex);
        require(_auctionTimeLeft(narrativeId) == 0, "Auction not finished");
        Narrative memory narrative = narratives[narrativeId];

        // if someone bid, require sender to have won auction
        if(narrative.auction.bidder != address(0)) {
            require(msg.sender == narrative.auction.bidder);
        } // otherwise fine you can mint

        // mint
        _mint(to, nftIds.current());
        mintedNarratives[nftIds.current()] = narrativeId;
        nftIds.increment();
    }

    function tokenURI(uint256 nftId) public view virtual override returns (string memory) {
        require(_exists(nftId), "NarrativeAuctionHouse.tokenURI id does not exist");
        string memory narrativeId = string(abi.encodePacked(mintedNarratives[nftId]));
        return string(abi.encodePacked("data:", narrativeId));
    }
}
