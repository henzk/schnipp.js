#!/bin/bash

if [ "$1" != "--single-run" ]
then
    echo "*** starting browser in 5 seconds"
    (sleep 5; chromium-browser http://localhost:9876) &
fi

echo "*** Starting karma testserver"

source ~/.nvm/nvm.sh
cd test
karma start $1

