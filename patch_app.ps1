$appJsPath = "c:\PROGRAMMAZIONE\movarisch\App.jsx"
$content = Get-Content $appJsPath -Raw

# 1. Add import after line with PPEOptimizer
$content = $content -replace "(import PPEOptimizer from './src/components/PPEOptimizer';)", "`$1`r`nimport PPEDatabaseManager from './src/components/PPEDatabaseManager';"

# 2. Add Database DPI tab before closing </div> of navigation
$tabToAdd = @"
          <button
            onClick={() => setView('database')}
            className={``flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition `${view === 'database' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}``}
          >
            <Database size={16} /> Database DPI
          </button>
"@

$content = $content -replace "(\s*<Database size=\{16\} /> Anagrafiche\s*</button>\s*</div>)", "$tabToAdd`r`n`$1"

# 3. Add view rendering before final </div>
$viewToAdd = @"
      {view === 'database' && (
        <PPEDatabaseManager />
      )}
"@

$content = $content -replace "(\s*\{view === 'data' && \(\s*<DataManagement />\s*\)\}\s*)(</div>)", "`$1$viewToAdd`r`n`$2"

# Save modified content
$content | Out-File -FilePath $appJsPath -Encoding UTF8 -NoNewline

Write-Host "App.jsx updated successfully!"
