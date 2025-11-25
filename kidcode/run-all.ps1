# Скрипт запускает backend и frontend в двух отдельных окнах PowerShell
# Запуск: откройте PowerShell и выполните: `d:\kidcode2\kidcode\run-all.ps1`

$projectRoot = 'd:\kidcode2\kidcode'
$backendPath = Join-Path $projectRoot 'backend'
$frontendPath = Join-Path $projectRoot 'frontend'

# Открыть новое окно PowerShell и запустить backend (npm run dev)
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$backendPath'; npm install; npm run dev" -WindowStyle Normal

# Открыть новое окно PowerShell и запустить frontend (npm run dev)
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$frontendPath'; npm install; npm run dev" -WindowStyle Normal

Write-Host 'Открыл(а) два окна PowerShell: backend и frontend. Проверяйте логи в открытых окнах.'
