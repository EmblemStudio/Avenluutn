//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NarratorNFTs is ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter public ids;

    mapping(uint256 => string) public URIs;

    constructor () ERC721("NarratorNFTs", "AN") {}

    function mint(address to, string memory URI) public {
        require(to != address(0), "Zero `to` address");
        uint256 id = ids.current();
        URIs[id] = URI;
        _mint(to, id);
        ids.increment();
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        require(_exists(id), "ID does not exist");
        return URIs[id];
    }
}
