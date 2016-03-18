#!/bin/bash
npm --prefix ./client install ./client
cd ./client/
npm install gulp -g
npm install --dev
node_modules/.bin/gulp build