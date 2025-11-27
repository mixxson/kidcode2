# Skrypt uruchamia backend i frontend w dwóch oddzielnych oknach PowerShell
# Uruchomienie: otwórz PowerShell i wykonaj: `d:\kidcode2\kidcode\run-all.ps1`

$projectRoot = 'd:\kidcode2\kidcode'
$backendPath = Join-Path $projectRoot 'backend'
$frontendPath = Join-Path $projectRoot 'frontend'

# Otworzyć nowe okno PowerShell i uruchomić backend (npm run dev)
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$backendPath'; npm install; npm run dev" -WindowStyle Normal

# Otworzyć nowe okno PowerShell i uruchomić frontend (npm run dev)
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$frontendPath'; npm install; npm run dev" -WindowStyle Normal

Write-Host 'Otwarto dwa okna PowerShell: backend i frontend. Sprawdzaj logi w otwartych oknach.'
