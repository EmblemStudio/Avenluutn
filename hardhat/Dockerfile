FROM node:16.4.2

RUN apt-get update && apt-get install -y jq

COPY contracts contracts
COPY .nvmrc .nvmrc
COPY scripts scripts
COPY package.json package.json
COPY hardhat.config.js hardhat.config.js

RUN yarn

RUN yarn build

CMD yarn up
