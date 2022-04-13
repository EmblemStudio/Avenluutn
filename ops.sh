#!/bin/bash

case $1 in
    "deploy")

    ;;
    "test")

    ;;
    "build")
        ./build.sh
    ;;
    "up")
        ./up_local.sh
    ;;
    *)
        echo "usage: ./ops.sh {deploy|test|build|up}"
    ;;
esac
