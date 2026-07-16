#!/usr/bin/env bash
# Copies the pre-built backend dist/ to the VPS app directory and restarts the service.
# Run from GitHub Actions after the build artifact has been uploaded via SCP.
set -euo pipefail

APP_DIR="${APP_DIR:?APP_DIR is required, e.g. /opt/loan-management/backend}"
PM2_NAME="${PM2_NAME:?PM2_NAME is required, e.g. loan-backend}"

echo "Installing production dependencies..."
cd "$APP_DIR"
npm ci --omit=dev

if [ ! -f "global-bundle.pem" ]; then
  echo "Downloading AWS RDS CA bundle..."
  curl -sS -o global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
fi

echo "Restarting $PM2_NAME via pm2..."
pm2 reload "$PM2_NAME" || pm2 restart "$PM2_NAME" || pm2 start dist/server.js --name "$PM2_NAME"

echo "Backend deployed."
