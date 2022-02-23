# Aavenluutn
(AH-ven-LOO-tn)
Adventure stories in the lootverse

## Dev env requirements

* docker
* docker-compose
* jq

## To run locally

Run the dev stack

`$ docker-compose --profile dev up -d`

Run the deploy script in the hardhat service

`$ docker-compose exec hardhat yarn deploy`

Run the dev UI server (from `/react`)

Find the publisher address from the hardhat logs and update
`react/src/constants.ts`

`docker-compose logs hardhat` (or grab it from the output of the deploy)

Then run the dev server

`/react $ yarn dev`

## To deploy or add narrators to test nets

You'll need keybase cli set up with the squad_games team file system synced

`yarn deploy:goerli`

## To publish the UI

Build it and then manually deploy the `dist` folder to netlify

`/react $ yarn build`

## Deploy the backend

Run the production stack on the server

`$ docker-compose --profile production up -d`