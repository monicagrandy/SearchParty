#!/bin/bash
# npm --prefix ./client install ./client
cd ./client/
npm install
npm install gulp -g
node_modules/.bin/gulp build
cd ..
cd ./public-share/
npm install