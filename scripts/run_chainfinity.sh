#!/usr/bin/env bash
#
# Start the ChainFinity application for local development.
#
# Fixes over the previous version:
#  - The compose file is infrastructure/docker-compose.yml (there is no
#    docker-compose.prod.yml).
#  - The web frontend lives at web-frontend/ (not code/frontend).
#  - The backend ASGI app is app.main:app (not app:app).
#  - Uses `docker compose` (v2) with a fallback to `docker-compose` (v1).
#  - Anchors all paths to the repository root so it works from anywhere.
#  - Cleans up child processes reliably on exit.

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Resolve the repository root (this script lives in scripts/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

echo -e "${GREEN}Starting ChainFinity Application...${NC}"

command_exists() { command -v "$1" >/dev/null 2>&1; }

# Resolve the Docker Compose command (v2 plugin preferred, v1 fallback).
if docker compose version >/dev/null 2>&1; then
    COMPOSE="docker compose"
elif command_exists docker-compose; then
    COMPOSE="docker-compose"
else
    COMPOSE=""
fi

# Check required tooling.
missing=()
command_exists npm || missing+=("npm")
command_exists python3 || missing+=("python3")
command_exists docker || missing+=("docker")
if [ "${#missing[@]}" -gt 0 ]; then
    echo -e "${YELLOW}Missing required tools: ${missing[*]}${NC}"
    echo -e "${YELLOW}Please install them and try again.${NC}"
    exit 1
fi
if [ -z "${COMPOSE}" ]; then
    echo -e "${RED}Docker Compose not found (need 'docker compose' or 'docker-compose').${NC}"
    exit 1
fi

COMPOSE_FILE="infrastructure/docker-compose.yml"

BLOCKCHAIN_PID=""
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo -e "\n${GREEN}Stopping all services...${NC}"
    for pid in "${FRONTEND_PID}" "${BACKEND_PID}" "${BLOCKCHAIN_PID}"; do
        if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
            kill "${pid}" 2>/dev/null || true
        fi
    done
    ${COMPOSE} -f "${COMPOSE_FILE}" down 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start infrastructure services (database, cache, monitoring).
echo -e "${GREEN}Starting infrastructure services...${NC}"
${COMPOSE} -f "${COMPOSE_FILE}" up -d postgres redis

# Start a local blockchain node, if the blockchain workspace is present.
if [ -f code/blockchain/hardhat.config.js ]; then
    echo -e "${GREEN}Starting blockchain node...${NC}"
    ( cd code/blockchain && npx hardhat node ) &
    BLOCKCHAIN_PID=$!
fi

# Start the backend (FastAPI/ASGI). DATABASE_URL etc. are expected in the
# environment or code/backend/.env; defaults target the compose Postgres.
echo -e "${GREEN}Starting backend server...${NC}"
(
    cd code/backend
    export DATABASE_URL="${DATABASE_URL:-postgresql+asyncpg://chainfinity:chainfinity@localhost:5432/chainfinity}"
    export REDIS_URL="${REDIS_URL:-redis://localhost:6379/0}"
    export ENVIRONMENT="${ENVIRONMENT:-development}"
    python3 -m uvicorn app.main:app --reload --port "${BACKEND_PORT:-8080}"
) &
BACKEND_PID=$!

# Start the web frontend.
echo -e "${GREEN}Starting frontend application...${NC}"
(
    cd web-frontend
    export REACT_APP_API_URL="${REACT_APP_API_URL:-http://localhost:8080}"
    npm start
) &
FRONTEND_PID=$!

echo -e "${GREEN}All services started!${NC}"
echo -e "${YELLOW}Backend:  http://localhost:${BACKEND_PORT:-8080}${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait on the background jobs; cleanup runs on Ctrl+C.
wait
