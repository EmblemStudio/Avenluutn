import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <>
      <div className="block">
        <div className="block has-text-grey">
          The Grand Adventure is a generative story game.
          Each season, adventures seek out quests where they will risk life and limb for glory.
          Players, guild patrons, can fund their ventures by purchasing shares of their success.
          Adventure stories are recorded forever on the pages of guild logbooks,
          where patrons can etch their own names by becoming sponsors.
        </div>
        <div className="block">
          <h2 className="subtitle is-garamond has-text-white">Role of NFTs</h2>
        </div>
        <div className="block has-text-grey">
          The Grand Adventure uses NFTs in two interesting and, we think, useful ways.
        </div>
        <div className="block has-text-grey">
          First, we remix content from the
          "<a className="is-underlined has-text-grey" href="https://www.lootproject.com/" target="_blank">Lootverse</a>",
          an ecosystem of content with open-use licenses that also exists as NFTs.
          Remixes of the content share "credit" with the originals in the sense that successful remixes may boost the original NFTs' value.
          The Grand Adventure remixes Loot NFT content in this way.
        </div>
        <div className="block has-text-grey">
          Second, each story in The Grand Adventure can be "sponsored" by minting it as an NFT on an energy-cheap blockchain.
          The right to mint is auctioned off after each story, and if no one bids, anyone can mint for gas-fees-only.
          Auction proceeds go to our team.
          On the backend, stories are "committed" as soon as we've launched a season: they are just revealed over time.
          We aren't using mechanics that promote price speculation: the supply of NFTs grows forever,
          we don't take royalties, and we've reserved no NFTs for ourselves.
        </div>
        <div>

        </div>
      </div>
      <Link to="/">
        <div className="is-underlined has-text-white">
          Back
        </div>
      </Link>
    </>
  )
}