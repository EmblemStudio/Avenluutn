//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NarrativeManager.sol";
import "./Narrators.sol";

contract NarrativeAuctionHouse is ERC721Enumerable {
    using Counters for Counters.Counter;
    using Narrators for Narrators.Narrator;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 constant public timeBuffer;

    // The address of the NarrativeManager contract
    NarrativeManager constant public narrativeManager;

    // The initial duration of auctions
    uint256 constant public baseAuctionDuration;

    // The minimum percentage difference between the last and current bid
    uint8 public minBidIncrementPercentage;

    // The minimum bid amount
    uint256 minimumBidAmount;

    struct Auction {
        // The current highest bid amount
        uint256 amount;

        // The address of the current highest bid
        address payable bidder;

        // The duration of this auction
        uint256 duration;
    };

    struct Narrative {
        uint256 narratorIndex; // the Nth narrator ever
        uint256 index; // the Nth narrative of this narrator
        uint256 copyIndex;
        Auction auction;
    };

    // Hash of the narrativeId to Narrative
    mapping(bytes32 -> Narrative) public narratives;

    Counters.Counter public nftIds;

    // NftId -> Narravive
    mapping(uint256 -> Narrative) public nfts;

    constructor(
        address _narrativeManager,
        uint256 _timeBuffer,
        uint256 _baseAuctionDuration,
        uint256 _minimumBidAmount,
        uint8 _minBidIncrementPercentage,
    ) public {
        narrativeManager = _narrativeManager;
        timeBuffer = _timeBuffer;
        baseAuctionDuration = _baseAuctionDuration;
        minimumBidAmount = _minimumBidAmount;
        minBidIncrementPercentage = _minBidIncrementPercentage;
    }

    function _auctionTimeLeft(bytes32 narrativeId) internal view returns (uint256) {
        // returns max uint256 if the auction is not open, and time left if it is
        Narrative narrative = narratives[narrativeId];
        Narrators.Narrator narrator = narratorManager.narrators(narrative.narratorIndex);
        uint256 narrativeStart = narrator.narrativeStartTime(narrative.index, narrative.copyIndex);
        uint256 narrativeEnd = narrativeStart + narrator.narrativeLength;
        if (narrativeEnd < now) {
            return type(uint256).max; // Narrative hasn't ended yet, auction not open
        }
        uint256 auctionEnd = narrativeEnd + narrative.auction.duration
        if (auctionEnd > now) {
            return 0; // Auction has ended
        }
        return auctionEnd - now;
    }

    function getNarrativeId(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex,
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(narratorIndex, narrativeIndex, copyIndex));
    }

    event Bid(bytes32 narrativeId, uint256 amount, uint256 bidder);
    event AuctionExtended(bytes32 narrativeId, uint256 newDuration);

    function bid(
        uint256 narratorIndex,
        uint256 narrativeIndex,
        uint256 copyIndex,
        uint256 amount
    ) external payable {
        require(msg.value == amount, "Sent ETH value must match bid amount");
        require(mintTo != address(0), "Invalid mintTo address");
        require(amount >= minBidAmount, "Bid below minimum bid amount")

        bytes32 narrativeId = getNarrativeId(narratorIndex, narrativeIndex, copyIndex);
        Narrative storage narrative = narratives[narrativeId];

        // initialize the narrative and auction if needed
        if (narrative.auction.bidder == address(0)) {
            narrative.narratorIndex = narratorIndex;
            narrative.index = narrativeIndex;
            narrative.copyIndex = copyIndex;
            narrative.auction.amount = amount;
            narrative.auction.bidder = msg.sender;
            narrative.auction.duration = baseAuctionDuration;
        }
        bytes32 timeLeft = _auctionTimeLeft(narrativeId);
        require(timeLeft > 0 && < type(uint256).max, "Auction not open");
        bytes32 minIncrement = (narrative.auction.amount * minBidIncrementPercentage) / 100;
        require(amount >= narrative.auction.amount + minIncrement, "Bid increment too low");

        // TODO implement WETH backup transfer

        // extend the auction if needed
        if (timeLeft < timeBuffer) {
            narrative.auction.duration += (timeBuffer - timeLeft);
            emit AuctionExtended(narrativeId, narrative.auction.duration);
        }

        // set current bidder as winning bidder
        // TODO add reentrency guard
        narrative.auction.bidder = msg.sender;
        narrative.auction.amount = amount;
        emit Bid(narrativeId, amount, msg.sender);

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
    ) public {
        require(to != address(0), "Invalid to address");
        bytes32 narrativeId = getNarrativeId(narratorIndex, narrativeIndex, copyIndex);
        require(_auctionTimeLeft(narrativeId) == 0, "Auction not finished");
        Narrative narrative = narratives[narrativeId];

        // if someone bid, require sender to have won auction
        if(narrative.auction.bidder != address(0)) {
            require(msg.sender == narrative.auction.bidder);
        } // otherwise fine you can mint

        // mint
        _mint(to, nftIds.current());
        nftIds.increment();
    }

    function tokenURI(uint256 nftId) public view returns string {
        require(_exists(nftId), "tokenURI call on non-existant id");
        string memory json = abi.encodePacked(string(narratives[nftId]));
        string memory encoded = Base64.encode(bytes(string(json)));
        return abi.encodePacked('data:application/json;base64,', encoded);
    }
}
