//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

library Narrators {

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
    };

    // narrativeStartTime requires narrative to exist and will revert otherwise
    function narrativeStartTime(
        Narrator narrator,
        uint256 narrativeIndex,
        uint256 copyIndex,
    ) internal pure returns (uint256 start) {
        require(
            narrativeIndex < narrator.totalNarrations,
            "narrativeIndex out of bounds"
        );
        require(copyIndex < narrator.copies, "invalid copy");
        uint256 start = narrativeIndex * narrator.narrativeSpacing + narrator.start;
        return start;
    }
}
