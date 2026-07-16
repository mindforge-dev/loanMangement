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
  echo "Reloading $PM2_NAME via pm2..."
  pm2 reload "$PM2_NAME" || pm2 restart "$PM2_NAME"
fi

echo "Frontend deployed."
