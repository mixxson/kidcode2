#!/usr/bin/env bash
# Запускает backend и frontend (Linux/macOS) в одном терминале с ловлей Ctrl+C.
# Автоустановка зависимостей при первом запуске.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/backend"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"

# Проверка Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js не найден. Установите: https://nodejs.org/ (например: sudo apt install nodejs npm)" >&2
  exit 1
fi

start_backend() {
  echo "[backend] npm install (если нужно)..."
  (cd "$BACKEND_DIR" && npm install)
  echo "[backend] запуск npm run dev"
  (cd "$BACKEND_DIR" && npm run dev) &
  BACK_PID=$!
}

start_frontend() {
  echo "[frontend] npm install (если нужно)..."
  (cd "$FRONTEND_DIR" && npm install)
  echo "[frontend] запуск npm run dev"
  (cd "$FRONTEND_DIR" && npm run dev) &
  FRONT_PID=$!
}

cleanup() {
  echo "\n[system] Остановка процессов..."
  for pid in "$BACK_PID" "$FRONT_PID"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
  echo "[system] Завершено."
}

trap cleanup INT TERM

start_backend
start_frontend

echo "\nBackend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"
echo "Нажмите Ctrl+C для остановки обоих."

# Ожидание завершения дочерних процессов
wait