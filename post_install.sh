#!/bin/bash
npm --prefix ./client install ./client
cd ./client/
node_modules/.bin/gulp build