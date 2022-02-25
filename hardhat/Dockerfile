FROM node:16.4.2

RUN apt-get update && apt-get install -y jq

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY contracts contracts
COPY scripts scripts
COPY hardhat.config.js hardhat.config.js
COPY .nvmrc .nvmrc

RUN yarn build

CMD yarn up
