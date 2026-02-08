#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

BACKEND_DIR="${BACKEND_DIR:-${PROJECT_ROOT}/backend}"
BACKEND_COMPOSE_FILE="${BACKEND_COMPOSE_FILE:-${BACKEND_DIR}/docker-compose.yml}"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not installed on this server"
  exit 1
fi

if [ ! -f "${BACKEND_COMPOSE_FILE}" ]; then
  echo "docker compose file not found: ${BACKEND_COMPOSE_FILE}"
  exit 1
fi

echo "Deploying backend from ${BACKEND_DIR}"
cd "${BACKEND_DIR}"

docker compose -f "${BACKEND_COMPOSE_FILE}" up -d --build --remove-orphans

echo "Backend deployment complete"
