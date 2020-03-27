#!/bin/bash
set -x

source ../config/deploy.conf

APP_DIR=$GIT_REPO

echo "KAKE"
echo $APP_DIR
### Automatic steps ###
if [[ -e $APP_DIR ]]; then
  cd $APP_DIR
  git pull
fi


# Install dependencies
npm install --production
npm prune --production

# Restart Server
pm2 restart server

