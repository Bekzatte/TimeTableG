#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PYTHON="$ROOT_DIR/.venv/bin/python"

if [[ ! -x "$BACKEND_PYTHON" ]]; then
  BACKEND_PYTHON="$ROOT_DIR/backend/.venv/bin/python"
fi

if [[ ! -x "$BACKEND_PYTHON" ]]; then
  BACKEND_PYTHON="python3"
fi

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if [[ ! -f "$BACKEND_DIR/server.py" ]]; then
  echo "Backend not found: $BACKEND_DIR/server.py"
  exit 1
fi

if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
  echo "Frontend not found: $FRONTEND_DIR/package.json"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Missing frontend dependencies. Run: cd frontend && npm install"
  exit 1
fi

echo "Starting backend on http://127.0.0.1:8000"
cd "$ROOT_DIR"
"$BACKEND_PYTHON" backend/server.py &
BACKEND_PID=$!

echo "Starting frontend dev server"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo
echo "Project is starting:"
echo "  Backend:  http://127.0.0.1:8000"
echo "  Frontend: http://127.0.0.1:5173"
echo
echo "Press Ctrl+C to stop both processes."

wait "$BACKEND_PID" "$FRONTEND_PID"
