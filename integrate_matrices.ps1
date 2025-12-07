# Script PowerShell per integrare le matrici in App.jsx

$appJsxPath = "c:\PROGRAMMAZIONE\movarisch\App.jsx"

# Leggi il contenuto del file
$content = Get-Content $appJsxPath -Raw -Encoding UTF8

# Definisci il codice da cercare e sostituire per STEP 2
$oldStep2 = @'
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">1. Stato Fisico</label>
                  <select value={physicalState} onChange={(e) => setPhysicalState(Number(e.target.value))} className="w-full p-2 border rounded">
'@

$newStep2 = @'
              {/* Matrici Visive */}
              <Matrix1QuantityUse 
                physicalState={physicalState}
                quantity={quantity}
                setPhysicalState={setPhysicalState}
                setQuantity={setQuantity}
                D_Index={D_Index}
              />
              
              <Matrix2UsageType 
                D_Index={D_Index}
                usageType={usageType}
                setUsageType={setUsageType}
                U_Index={U_Index}
              />
              
              <Matrix3ControlType 
                U_Index={U_Index}
                controlType={controlType}
                setControlType={setControlType}
                C_Index={C_Index}
              />
              
              <Matrix4ExposureTime 
                C_Index={C_Index}
                exposureTime={exposureTime}
                setExposureTime={setExposureTime}
                I_Val={I_Val}
              />
              
              {/* Distanza */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Distanza dalla sorgente (d)</label>
                <select value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full p-2 border rounded">
'@

# Controlla se la sostituzione è necessaria
if ($content -match [regex]::Escape($oldStep2)) {
    Write-Host "✓ Trovato il pattern da sostituire in STEP 2" -ForegroundColor Green
    
    # Fai un backup
    Copy-Item $appJsxPath "$appJsxPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "✓ Backup creato" -ForegroundColor Green
    
    # Sostituisci
    $content = $content -replace [regex]::Escape($oldStep2), $newStep2
    
    # Salva
    $content | Set-Content $appJsxPath -Encoding UTF8 -NoNewline
    Write-Host "✓ STEP 2 aggiornato con successo!" -ForegroundColor Green
} else {
    Write-Host "✗ Pattern non trovato. Verifica manualmente il file." -ForegroundColor Red
    Write-Host "Cerca la riga 415 circa con 'grid md:grid-cols-2 gap-6'" -ForegroundColor Yellow
}
