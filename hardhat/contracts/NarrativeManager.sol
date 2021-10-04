//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Narrators.sol"

contract NarrativeManager is Ownable {
    using Counters for Counters.Counter;

    Narrators.Narrator[] public narrators; // append only list of narrators
    Counters.Counter public narratorCount;

    constructor(Narrators.Narrator narrator) public {
        addNarrator(narrator);
    }

    event NarratorAdded (Narrators.Narrator narrator, uint256 count);

    function addNarrator(Narrators.Narrator narrator) ownerOnly {
        // TODO check that NFT exists
        // TODO check that nftAddress implements ERC721
        require(
                narrator.totalNarratives > 0,
                "totalNarratives must be greater than 0",
        );
        require(
                narrator.copies > 0,
                "copies must be greater than 0",
                );
        require(
                narrator.narrativeSpacing > 0,
                "narrativeSpacing must be greater than 0",
                );
        narrators.push(narrator);
        narratorCount.increment(); // :o
        emit NarratorAdded(narrator, narratorCount.current());
    }
}
