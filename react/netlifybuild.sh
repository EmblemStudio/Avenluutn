#!/bin/bash

cd ../scripts
yarn install
yarn build

cd ../hardhat
yarn install
yarn build

cd ../react
yarn install
yarn build
