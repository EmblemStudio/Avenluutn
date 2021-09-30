//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NarrativeManager is Ownable {
    using Counters for Counters.Counter;

    /**
     * Narrators are represented by an NFT. They have a hash of the
     * code, a link to the code and maybe some metadata. The script
     * generates content by reading blocks between the start and end
     * blocks and using them as seeds for generation.
     */
    struct Narrator {
        address NFTAddress;
        uint256 NFTId;
        uint256 start; // when this narrator becomes active
        uint256 end; // when it stops being active
        uint256 narrativeLength; // seconds between narration start and end
        uint256 narrativeSpacing; // seconds between narration starts
        uint256 copies; // number of simultanious narrations
    };

    Narrator[] public narrators; // append only list of narrators
    Counters.Counter public narratorCount;

    event NarratorAdded (Narrator narrator, uint256 count);

    constructor(Narrator narrator) public {
        addNarrator(narrator);
    }

    function addNarrator(Narrator narrator) ownerOnly {
        // TODO check that NFT exists
        // TODO check that nftAddress implements ERC721
        require(
            narrator.endBlock > narrator.startBlock,
            "end block not after start block",
        );
        require(narrationSpacing > 0, "narrationSpacing must be greater than 0");
        require(copies > 0, "copies must be greater than 0");
        narrators.push(narrator);
        narratorCount.increment(); // :0
        emit NarratorAdded(narrator, narratorCount.current());
    }
}
