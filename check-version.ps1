# Script per verificare la versione deployata
$url = "https://movarisch.safetyprosuite.com/version.txt"

Write-Host "Checking deployed version..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers @{"Cache-Control"="no-cache"}
    $version = $response.Content.Trim()
    $timestamp = [DateTimeOffset]::FromUnixTimeSeconds([long]$version).LocalDateTime

    Write-Host "Deployed Version:" -ForegroundColor Green
    Write-Host "  Timestamp: $version" -ForegroundColor Yellow
    Write-Host "  Date: $timestamp" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Status: OK" -ForegroundColor Green
} catch {
    Write-Host "Error checking version:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure /version.txt exists in dist/" -ForegroundColor Yellow
}
