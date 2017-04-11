#!/bin/bash

#DEPLOY_CONFIG=$1
#PORT=$2
#
#[ -z DEPLOY_CONFIG ] && exit 1
#if [ -z PORT ]; then
#	PORT="80"
#fi

export NODE_ENV=production
yarn install || npm install

./node_modules/.bin/gulp deploy -p
