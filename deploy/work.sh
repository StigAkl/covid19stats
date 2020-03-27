#!/bin/bash
set -x

. /root/covid19stats/config/deploy.conf

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

