#!/bin/bash
#
# builds API-Docs using jsdoc
# export JSDOCDIR and JSDOCTEMPLATEDIR and run the script using _bash_

if [ -z "${BASH_SOURCE}" ]; then
    echo "this script needs a bash"
    exit 1
fi

if [ -z "${JSDOCDIR}" ]; then
    export JSDOCDIR="$HOME/tools/jsdoc"
fi

if [ -z "${JSDOCTEMPLATEDIR}" ]; then
    export JSDOCTEMPLATEDIR="$HOME/tools/jsdoc/templates/jsdoc2-bootstrap-theme"
fi

#bashism ...BASH_SOURCE n.a. in other shells, e.g. dash
_BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
_BASE_DIR="$(dirname $_BASE_DIR)"

#better check before doing rm
if [ ! -f "${_BASE_DIR}/src/schnipp.js" ]; then
    echo "something went terribly wrong during directory detection ... aborted"
    exit 1
fi

OUTPUTDIR="${_BASE_DIR}/docs/api"

echo -n "deleting previously generated apidocs "
rm -rf "$OUTPUTDIR"
mkdir -p "$OUTPUTDIR"
echo "OK"
#regenerate api docs
sh ${JSDOCDIR}/jsrun.sh -r=10 -a -p -d=$OUTPUTDIR ${_BASE_DIR}/src $@
