Write-Host "--- Zest Code Branch Cleanup ---" -ForegroundColor Cyan

$confirm = Read-Host "Удалить все локальные и удаленные ветки feature/* и hotfix/*? (y/n)"
if ($confirm -ne 'y') { Write-Host "Отменено."; exit }

# 1. Локальное удаление
Write-Host "`n[1/3] Удаление локальных веток..." -ForegroundColor Yellow
$localBranches = git branch | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^(feature/|hotfix/)' }

if ($localBranches) {
    $localBranches | ForEach-Object { git branch -D $_ }
} else {
    Write-Host "Локальных веток не найдено."
}

# 2. Удаленное удаление (origin)
Write-Host "`n[2/3] Удаление веток из origin..." -ForegroundColor Yellow
$remoteBranches = git branch -r | ForEach-Object { $_.Trim() } | Where-Object { $_ -match 'origin/(feature|hotfix)/' }

if ($remoteBranches) {
    $remoteBranches | ForEach-Object { 
        $branchName = $_.Replace('origin/', '')
        git push origin --delete $branchName 
    }
} else {
    Write-Host "Удаленных веток не найдено."
}

# 3. Синхронизация
Write-Host "`n[3/3] Синхронизация (prune)..." -ForegroundColor Yellow
git fetch --prune

Write-Host "`nГотово! Репозиторий очищен." -ForegroundColor Green