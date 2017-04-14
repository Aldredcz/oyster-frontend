#!/bin/bash

export NODE_ENV=production
yarn install || npm install
npm run flow-typed:install

npm run test
