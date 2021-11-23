//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// TODO consider using concurrent narrators as opposed to collections of stories

contract Publisher is ReentrancyGuard, Ownable, ERC721Enumerable {
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
        uint256 totalCollections; // How many narrations before it's inactive
        uint256 collectionLength; // seconds between story start and end
        uint256 collectionSpacing; // seconds between story starts
        uint256 collectionSize; // number of simultanious stories
        // TODO consider adding story stagger amount
    }

    struct Story {
        uint256 narratorIndex; // the Nth arrator ever
        uint256 collectionIndex; // the Nth collection of that narrator
        uint256 index; // the Nth story of that collection
        Auction auction;
    }

    // storyId: keccak(narratorIndex, collectionIndex, storyIndex) => Story
    mapping(bytes32 => Story) public stories;

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

    // nftId -> StoryId
    mapping(uint256 => bytes32) public mintedStories;

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
        uint256 start,
        uint256 totalCollections,
        uint256 collectionLength,
        uint256 collectionSpacing,
        uint256 collectionSize
    ) public onlyOwner {
        // TODO check that NFT exists
        // TODO check that nftAddress implements ERC721
        require(
                totalCollections > 0,
                "totalCollections must be greater than 0"
        );
        require(
                collectionSize > 0,
                "collectionSize must be greater than 0"
                );
        require(
                collectionSpacing > 0,
                "collectionSpacing must be greater than 0"
                );

        Narrator storage narrator = narrators[narratorCount.current()];
        narrator.NFTAddress = NFTAddress;
        narrator.NFTId = NFTId;
        narrator.start = start;
        narrator.totalCollections = totalCollections;
        narrator.collectionLength = collectionLength;
        narrator.collectionSpacing = collectionSpacing;
        narrator.collectionSize = collectionSize;

        emit NarratorAdded(narrator, narratorCount.current());
        narratorCount.increment(); // :o
    }

    // storyStartTime requires story to exist and will revert otherwise
    function storyStartTime(
        uint256 narratorIndex,
        uint256 collectionIndex,
        uint256 storyIndex
    ) public view returns (uint256) {
        require(
            narratorIndex < narratorCount.current(),
            "Publisher: Invalid Narrator"
        );
        Narrator memory narrator = narrators[narratorIndex];
        require(
            collectionIndex < narrator.totalCollections,
            "Publisher: Invalid collection"
        );
        require(storyIndex < narrator.collectionSize, "Publisher: Invalid collection");
        uint256 start = collectionIndex * narrator.collectionSpacing + narrator.start;
        return start;
    }

    function _auctionTimeLeft(bytes32 storyId) internal view returns (uint256) {
        // returns max uint256 if the auction is not open, and time left if it is
        Story memory story = stories[storyId];
        uint256 storyStart = storyStartTime(
            story.narratorIndex,
            story.collectionIndex,
            story.index
        );
        Narrator memory narrator = narrators[story.narratorIndex];
        uint256 auctionStart = storyStart + narrator.collectionLength;
        if (block.timestamp < auctionStart) {
            return type(uint256).max; // Story hasn't ended yet, auction not open
        }
        uint256 auctionEnd = auctionStart + story.auction.duration;
        if (block.timestamp > auctionEnd) {
            return 0; // Auction has ended
        }
        return auctionEnd - block.timestamp;
    }

    function getStoryId(
        uint256 narratorIndex,
        uint256 collectionIndex,
        uint256 storyIndex
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(narratorIndex, collectionIndex, storyIndex));
    }

    event Bid(
        uint256 indexed narratorIndex,
        uint256 indexed collectionIndex,
        uint256 indexed storyIndex,
        uint256 amount,
        address bidder
    );

    event AuctionExtended(
        uint256 indexed narratorIndex,
        uint256 indexed collectionIndex,
        uint256 indexed storyIndex,
        uint256 newDuration
    );

    function bid(
        uint256 narratorIndex,
        uint256 collectionIndex,
        uint256 storyIndex,
        address mintTo
    ) nonReentrant external payable returns (bool) {
        require(mintTo != address(0), "Invalid mintTo address");
        require(msg.value >= minBidAmount, "Bid below minimum bid amount");

        bytes32 storyId = getStoryId(narratorIndex, collectionIndex, storyIndex);
        Story storage story = stories[storyId];

        // initialize the story and auction if needed
        if (story.auction.bidder == address(0)) {
            story.narratorIndex = narratorIndex;
            story.collectionIndex = collectionIndex;
            story.index = storyIndex;
            story.auction.duration += baseAuctionDuration;
        } else {
            uint256 minIncrement = (
                story.auction.amount * minBidIncrementPercentage
            ) / 100;
            require(
                msg.value >= story.auction.amount + minIncrement,
                "Bid increment too low"
            );
        }

        uint256 timeLeft = _auctionTimeLeft(storyId);
        require(timeLeft > 0 && timeLeft < type(uint256).max, "Auction not open");

        // extend the auction if needed
        if (timeLeft < timeBuffer) {
            story.auction.duration += (timeBuffer - timeLeft);
            emit AuctionExtended(
                narratorIndex,
                collectionIndex,
                storyIndex,
                story.auction.duration
            );
        }

        // TODO implement WETH backup transfer
        address previousBidder = story.auction.bidder;
        uint256 previousAmount = story.auction.amount;

        // set current bidder as winning bidder
        story.auction.bidder = payable(msg.sender);
        story.auction.amount = msg.value;
        emit Bid(narratorIndex, collectionIndex, storyIndex, msg.value, msg.sender);

        // return previous bidder their bid
        if (previousBidder != address(0)) {
            (bool sent,) = previousBidder.call{value: previousAmount}("");
            // TODO what happens when the refund to previous bidder fails?
            return sent;
        }

        return true;
    }

    function mint(
        uint256 narratorIndex,
        uint256 collectionIndex,
        uint256 storyIndex,
        address to
    ) nonReentrant public {
        require(to != address(0), "Invalid to address");
        bytes32 storyId = getStoryId(narratorIndex, collectionIndex, storyIndex);
        require(_auctionTimeLeft(storyId) == 0, "Auction not finished");
        Story memory story = stories[storyId];

        // if someone bid, require sender to have won auction
        if(story.auction.bidder != address(0)) {
            require(msg.sender == story.auction.bidder);
            // Pay the beneficiary
            address beneficiary = payable(owner());
            (bool sent, bytes memory data) = beneficiary.call{
                value: story.auction.amount
            }("");
        } // otherwise fine you can mint

        // mint
        _mint(to, nftIds.current());
        mintedStories[nftIds.current()] = storyId;
        nftIds.increment();
    }

    function tokenURI(uint256 nftId) public view virtual override returns (string memory) {
        require(_exists(nftId), "StoryAuctionHouse.tokenURI id does not exist");
        string memory storyId = string(abi.encodePacked(mintedStories[nftId]));
        return string(abi.encodePacked("data:", storyId));
    }
}
