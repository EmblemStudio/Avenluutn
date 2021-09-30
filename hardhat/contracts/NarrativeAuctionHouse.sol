//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NarrativeManager.sol";

contract NarrativeAuctionHouse is ERC721Enumerable {
    using Counters for Counters.Counter;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 constant public timeBuffer;

    // The address of the NarrativeManager contract
    address constant public narrativeManager;

    // The initial duration of auctions
    uint256 constant public baseAuctionDuration;

    struct Auction {
        // The current highest bid amount
        uint256 amount;

        // The address of the current highest bid
        address payable bidder;

        // The duration of this auction
        uint256 duration;
    };

    // TODO refactor the struct nesting
    struct Narrative {
        uint256 narrativeIndex; // the Nth narrative of this narrator
        // narrativeStartTime is
        // narrator.start + (narrativeIndex * narrator.narrativeSpacing)
        uint256 copy;
        uint256 narratorIndex;
        Auction auction;
    };

    // Hash of the narrative to it's inputs
    mapping(bytes32 -> Narrative) public narratives;

    constructor(
                address _narrativeManager,
                uint256 _timeBuffer,
                uint256 _baseAuctionDuration,
                ) public {
        narrativeManager = _narrativeManager;
        timeBuffer = _timeBuffer;
        baseAuctionDuration = _baseAuctionDuration;
    }

    function _auctionOpen(Narrative narrative) internal view returns (bool) {
        // the narrative exists
        //// narrative.narrativeIndex >= 0 && <= narrativeManager.narratorCount
        //// narrative.narrativeIndex * narrativeSpacing + narrator.start < narrator.end
        //// narrative.copy >= 0 && <= narrator.coppies

        // the narrative has ended
        //// narrativeStartTime + narrativeLength <= now

        // auction hasn't ended
        //// narrativeStartTime + narrativeLength + max(auction.duration, default) < now
    }

    function bid(Narrative narrative, uint256 amount) external payable {
        require(_auctionOpen(narrative), "Auction not open");
        require(amount > _currentHighestBid(narrative), "Bid too low");
        require(mintTo != address(0), "Invalid mintTo address");

        // if is first bid, create auction, set default duration
    }

    function mint(bytes32 narrativeId, address to) auctionFinished {
        // if no one bid, okay sure you can have it

        // if someone bid only the winner may call this
    }

    function tokenURI(uint256 nftId) returns string {
        // IPFS hash of the script and the inputs to that script for this nftId
    }

}
