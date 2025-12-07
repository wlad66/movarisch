$appJsPath = "c:\PROGRAMMAZIONE\movarisch\App.jsx"
$content = Get-Content $appJsPath -Raw

# 1. Add import - find the line with PPEOptimizer import and add after it
if ($content -notmatch "PPEDatabaseManager") {
    $content = $content -replace "(import PPEOptimizer from './src/components/PPEOptimizer';)", "`$1`r`nimport PPEDatabaseManager from './src/components/PPEDatabaseManager';"
    Write-Host "Added import"
}

# 2. Add Database DPI tab - find the Anagrafiche button and add Database DPI button after the closing </div>
if ($content -notmatch "Database DPI") {
    # Find the pattern: Anagrafiche button followed by </div>
    $pattern = "(<Database size=\{16\} /> Anagrafiche\s*</button>\s*)(</div>)"
    $replacement = "`$1`r`n          <button`r`n            onClick={() => setView('database')}`r`n            className={``flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition `${view === 'database' ? 'bg-slate-50 text-blue-900' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}``}`r`n          >`r`n            <Database size={16} /> Database DPI`r`n          </button>`r`n        `$2"
    $content = $content -replace $pattern, $replacement
    Write-Host "Added navigation tab"
}

# 3. Add view rendering - find {view === 'data' && and add database view after it
if ($content -notmatch "view === 'database'") {
    $pattern = "(\{view === 'data' && \(\s*<DataManagement />\s*\)\})"
    $replacement = "`$1`r`n      {view === 'database' && (`r`n        <PPEDatabaseManager />`r`n      )}"
    $content = $content -replace $pattern, $replacement
    Write-Host "Added view rendering"
}

# Save
$content | Out-File -FilePath $appJsPath -Encoding UTF8 -NoNewline
Write-Host "App.jsx patched successfully!"
