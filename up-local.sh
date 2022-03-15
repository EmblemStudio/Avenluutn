#!/bin/bash

docker-compose -f docker-compose.yml -f docker-compose-local.yml up -d

sleep 10s

docker-compose exec hardhat yarn deploy
