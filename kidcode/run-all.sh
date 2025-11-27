#!/usr/bin/env bash
# Uruchamia backend i frontend (Linux/macOS) w jednym terminalu z obsługą Ctrl+C.
# Automatyczna instalacja zależności przy pierwszym uruchomieniu.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/backend"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"

# Sprawdzenie Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js nie znaleziony. Zainstaluj: https://nodejs.org/ (np.: sudo apt install nodejs npm)" >&2
  exit 1
fi

start_backend() {
  echo "[backend] npm install (jeśli potrzebne)..."
  (cd "$BACKEND_DIR" && npm install)
  echo "[backend] uruchamianie npm run dev"
  (cd "$BACKEND_DIR" && npm run dev) &
  BACK_PID=$!
}

start_frontend() {
  echo "[frontend] npm install (jeśli potrzebne)..."
  (cd "$FRONTEND_DIR" && npm install)
  echo "[frontend] uruchamianie npm run dev"
  (cd "$FRONTEND_DIR" && npm run dev) &
  FRONT_PID=$!
}

cleanup() {
  echo "\n[system] Zatrzymywanie procesów..."
  for pid in "$BACK_PID" "$FRONT_PID"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
  echo "[system] Zakończono."
}

trap cleanup INT TERM

start_backend
start_frontend

echo "\nBackend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"
echo "Naciśnij Ctrl+C aby zatrzymać oba procesy."

# Oczekiwanie na zakończenie procesów potomnych
wait