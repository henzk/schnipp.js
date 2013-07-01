#!/bin/bash

source ~/.nvm/nvm.sh
yuidoc -t ./docs/apidocs/schnipp-yuidoc-theme -c ./docs/apidocs/yuidoc.json -o ./docs/apidocs/_build ./src/
