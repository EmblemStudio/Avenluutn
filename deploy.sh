#!/bin/bash

set -e

docker-compose down
git pull
docker-compose up -d
