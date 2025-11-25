@echo off
REM Запускает backend и frontend в отдельных окнах (Windows)
SET ROOT_DIR=d:\kidcode2\kidcode

start "Backend" cmd /k "cd /d %ROOT_DIR%\backend && npm install && npm run dev"
start "Frontend" cmd /k "cd /d %ROOT_DIR%\frontend && npm install && npm run dev"

echo Открыло окна для backend и frontend. Закройте это окно, если хотите.
pause
