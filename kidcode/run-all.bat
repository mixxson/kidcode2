@echo off
REM Uruchamia backend i frontend w oddzielnych oknach (Windows)
SET ROOT_DIR=d:\kidcode2\kidcode

start "Backend" cmd /k "cd /d %ROOT_DIR%\backend && npm install && npm run dev"
start "Frontend" cmd /k "cd /d %ROOT_DIR%\frontend && npm install && npm run dev"

echo Otwarto okna dla backend i frontend. Zamknij to okno, jeśli chcesz.
pause
