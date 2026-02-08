#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRONTEND_DIR="${FRONTEND_DIR:-${PROJECT_ROOT}/frontend}"
FRONTEND_DEPLOY_DIR="${FRONTEND_DEPLOY_DIR:-}"
FRONTEND_RELOAD_SERVICE="${FRONTEND_RELOAD_SERVICE:-}"
SUDO_BIN="${SUDO_BIN:-sudo}"

if [ -z "${FRONTEND_DEPLOY_DIR}" ]; then
  echo "FRONTEND_DEPLOY_DIR is required (example: /var/www/loan-management-frontend)"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not installed on this server"
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not installed on this server"
  exit 1
fi

echo "Building frontend from ${FRONTEND_DIR}"
cd "${FRONTEND_DIR}"
npm ci
npm run build

echo "Syncing dist to ${FRONTEND_DEPLOY_DIR}"
mkdir -p "${FRONTEND_DEPLOY_DIR}"
rsync -a --delete "${FRONTEND_DIR}/dist/" "${FRONTEND_DEPLOY_DIR}/"

if [ -n "${FRONTEND_RELOAD_SERVICE}" ]; then
  echo "Reloading service ${FRONTEND_RELOAD_SERVICE}"
  ${SUDO_BIN} systemctl reload "${FRONTEND_RELOAD_SERVICE}"
fi

echo "Frontend deployment complete"
