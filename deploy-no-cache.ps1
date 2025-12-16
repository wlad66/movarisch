# =====================================================
# DEPLOY MOVARISCH - FORCE NO CACHE
# Questo script forza il rebuild completo senza cache
# =====================================================

$ErrorActionPreference = "Stop"

Write-Host "=== MOVARISCH DEPLOY (NO CACHE) ===" -ForegroundColor Cyan
Write-Host ""

# Configurazione
$VPS_IP = "72.61.189.136"
$VPS_USER = "root"
$VPS_PASSWORD = "0z3u88E.QVaNnAx,h8V+"
$VPS_PATH = "/opt/movarisch-new"

# 1. BUILD LOCALE
Write-Host "1. Building frontend locally..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# 2. COPIA DIST IN SERVER
Write-Host "2. Copying dist to server/dist..." -ForegroundColor Yellow
Remove-Item -Path "server\dist" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "dist" -Destination "server\dist" -Recurse

# 3. CREA TIMESTAMP PER CACHE BUSTING
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
Write-Host "3. Cache bust timestamp: $timestamp" -ForegroundColor Yellow

# 4. AGGIORNA VERSION.TXT
$timestamp | Out-File -FilePath "server\dist\version.txt" -Encoding utf8 -NoNewline

# 5. CREA ARCHIVIO
Write-Host "4. Creating archive..." -ForegroundColor Yellow
tar -czf dist.tar.gz -C server dist

# 6. UPLOAD VPS
Write-Host "5. Uploading to VPS..." -ForegroundColor Yellow

# Crea script SSH per evitare problemi con password
$sshPass = "sshpass -p '$VPS_PASSWORD'"

# Upload files
& scp -o StrictHostKeyChecking=no dist.tar.gz "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
& scp -o StrictHostKeyChecking=no Dockerfile "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
& scp -o StrictHostKeyChecking=no nginx.conf "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"
& scp -o StrictHostKeyChecking=no server\controllers\auth.controller.js "${VPS_USER}@${VPS_IP}:${VPS_PATH}/server/controllers/"

# 7. DEPLOY SU VPS (CON PULIZIA CACHE)
Write-Host "6. Deploying on VPS (force rebuild)..." -ForegroundColor Yellow

$deployScript = @"
cd $VPS_PATH

# Estrai archivio
echo 'Extracting dist.tar.gz...'
tar -xzf dist.tar.gz

# Stop containers
echo 'Stopping containers...'
docker-compose down

# PULIZIA CACHE DOCKER
echo 'Cleaning Docker cache...'
# Rimuovi immagini vecchie di movarisch
docker images | grep movarisch-new | awk '{print `$3}' | xargs -r docker rmi -f

# Rimuovi build cache
docker builder prune -f

# REBUILD COMPLETO SENZA CACHE
echo 'Rebuilding images (NO CACHE)...'
docker-compose build --no-cache --pull

# Restart containers
echo 'Starting containers...'
docker-compose up -d

# Verifica
echo 'Verifying containers...'
docker ps | grep movarisch

# PULIZIA FILE TEMPORANEI
rm -f dist.tar.gz

# Mostra hash deploy per verifica
echo ''
echo '=== DEPLOY HASH ==='
sha256sum server/dist/index.html | cut -d' ' -f1
echo '==================='

echo ''
echo 'Deploy completed!'
"@

& ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" $deployScript

Write-Host ""
Write-Host "=== DEPLOY COMPLETED ===" -ForegroundColor Green
Write-Host "Timestamp: $timestamp" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifica su: https://movarisch.safetyprosuite.com" -ForegroundColor Cyan
Write-Host "Forza refresh browser: CTRL+SHIFT+R (Chrome) o CTRL+F5 (Firefox)" -ForegroundColor Yellow
Write-Host ""
