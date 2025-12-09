# MoVaRisCh Deploy Script
$VpsIp = "72.61.189.136"
$VpsUser = "root"
$VpsPath = "/opt/movarisch-new"
$Password = "0z3u88E.QVaNnAx,h8V+"

Write-Host "`n=== MoVaRisCh Deploy Script ===" -ForegroundColor Cyan

# STEP 1: Build
Write-Host "`nSTEP 1: Build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "OK Build completato" -ForegroundColor Green

# STEP 2: Copia dist
Write-Host "`nSTEP 2: Copia dist..." -ForegroundColor Yellow
if (Test-Path "server\dist") {
    Remove-Item -Recurse -Force "server\dist"
}
Copy-Item -Recurse -Force "dist" "server\dist"
Write-Host "OK Dist copiato" -ForegroundColor Green

# STEP 3: Archivi
Write-Host "`nSTEP 3: Creazione archivi..." -ForegroundColor Yellow
if (Test-Path "dist.tar.gz") { Remove-Item "dist.tar.gz" }
tar -czf dist.tar.gz -C server dist
Write-Host "OK Archivi creati" -ForegroundColor Green

# STEP 4: Upload
Write-Host "`nSTEP 4: Upload su VPS..." -ForegroundColor Yellow
echo $Password | pscp -batch -pw $Password dist.tar.gz "${VpsUser}@${VpsIp}:${VpsPath}/"
echo $Password | pscp -batch -pw $Password Dockerfile "${VpsUser}@${VpsIp}:${VpsPath}/"
echo $Password | pscp -batch -pw $Password nginx.conf "${VpsUser}@${VpsIp}:${VpsPath}/"
Write-Host "OK File caricati" -ForegroundColor Green

# STEP 5: Extract files (BEFORE build)
Write-Host "`nSTEP 5: Extract files..." -ForegroundColor Yellow
$cmd = "cd /opt/movarisch-new && tar -xzf dist.tar.gz -C server/"
echo $Password | plink -batch -pw $Password -t "${VpsUser}@${VpsIp}" $cmd
Write-Host "OK Files extracted" -ForegroundColor Green

# STEP 6: Build images
Write-Host "`nSTEP 6: Build Docker images..." -ForegroundColor Yellow
$cmd = "cd /opt/movarisch-new && docker-compose build --no-cache"
echo $Password | plink -batch -pw $Password -t "${VpsUser}@${VpsIp}" $cmd
Write-Host "OK Images built" -ForegroundColor Green

# STEP 7: Deploy
Write-Host "`nSTEP 7: Deploy containers..." -ForegroundColor Yellow
$cmd = "cd /opt/movarisch-new && docker-compose down && docker-compose up -d --force-recreate && sleep 3 && docker-compose ps"
echo $Password | plink -batch -pw $Password -t "${VpsUser}@${VpsIp}" $cmd

Write-Host "`nOK Deploy completato!" -ForegroundColor Green

# Cleanup
Remove-Item "dist.tar.gz" -ErrorAction SilentlyContinue
Remove-Item "server-files.tar.gz" -ErrorAction SilentlyContinue

Write-Host "`n=== DEPLOY COMPLETATO ===" -ForegroundColor Green
Write-Host "URL: https://movarisch.safetyprosuite.com`n" -ForegroundColor Cyan
