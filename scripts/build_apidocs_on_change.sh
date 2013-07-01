#!/bin/bash

#
# rebuilds apidoc automatically when changing files during development
#
# must be run from main directory or using "make apidocsonchange"
#

while true; do
	inotifywait -e create -e modify -e delete -r ./src/ && bash ./scripts/build_apidocs.sh
done
