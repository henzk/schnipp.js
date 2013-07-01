help:
	echo "schnipp.js Makefile"
	echo "===================="
	echo ""
	echo "Targets:"
	echo ""
	echo " tdd"
	echo "  run karma server for unittests - see tests/README-TESTING.rst for installation instructions"
	echo ""
	echo " apidocs"
	echo "  generate apidocs in /docs/apidocs/_build/"
	echo ""
	echo " apidocsonchange"
	echo "  generate apidocs whenever a sourcefile changes(requires inotify-tools)"
	echo ""
	echo " devenv"
	echo "  combination of tdd and apidocsonchange"
	echo ""
	echo "That's all folks! Have fun!"


tdd:
	xterm -T "karma test" -n "karma test" -fg gray -bg black -e bash -c "bash scripts/run_karma_dev.sh;sleep 5;" &


apidocs:
	bash ./scripts/build_apidocs.sh


apidocsonchange:
	xterm -T "yuidoc" -n "yuidoc" -fg gray -bg black -e bash ./scripts/build_apidocs_on_change.sh &


devenv: tdd apidocsonchange
