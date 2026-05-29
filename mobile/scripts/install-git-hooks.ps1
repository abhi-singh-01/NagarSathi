# Installs prepare-commit-msg hook to block Cursor co-author on commits
# Monorepo root (NagarSathi/.git)
$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$hooksDir = Join-Path $repoRoot ".git\hooks"
$source = Join-Path $PSScriptRoot "git-hooks\prepare-commit-msg"

New-Item -ItemType Directory -Force -Path $hooksDir | Out-Null
Copy-Item $source (Join-Path $hooksDir "prepare-commit-msg") -Force
Write-Host "Installed prepare-commit-msg hook in $hooksDir"
Write-Host "Cursor Co-authored-by lines will be removed from commit messages."
