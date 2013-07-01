schnipp.js Documentation
=========================

How to build the api docs
--------------------------

- Install node.js e.g. using nvm on linux(see README-TESTING)

- Install yuidoc::

    source ~/.nvm/nvm.sh
    npm -g install yuidoc


- generate the API-Docs::

    make apidocs


After that, the docs are located in ``docs/apidocs/_build``.
