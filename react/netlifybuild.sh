#!/bin/bash

cd ../hardhat
yarn install
yarn build

cd ../react
yarn install
yarn build
