#!/usr/bin/env bash
# Copies the pre-built frontend dist/ to the web root and reloads the web server.
# Run from GitHub Actions after the build artifact has been uploaded via SCP.
set -euo pipefail

DIST_DIR="${DIST_DIR:?DIST_DIR is required, e.g. /opt/loan-management/frontend-dist}"
WEB_ROOT="${WEB_ROOT:?WEB_ROOT is required, e.g. /var/www/loan-management}"
PM2_NAME="${PM2_NAME:-}"

echo "Syncing $DIST_DIR → $WEB_ROOT..."
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$DIST_DIR/" "$WEB_ROOT/"

if [ -n "$PM2_NAME" ]; then
  if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
    echo "Reloading $PM2_NAME via pm2..."
    pm2 reload "$PM2_NAME"
  else
    echo "PM2 process '$PM2_NAME' not active or found. Skipping PM2 reload."
  fi
fi

echo "Frontend deployed."
