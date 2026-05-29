$repoRoot = Split-Path $PSScriptRoot -Parent
$hooksDir = Join-Path $repoRoot ".git\hooks"
$source = Join-Path $PSScriptRoot "git-hooks\prepare-commit-msg"
New-Item -ItemType Directory -Force -Path $hooksDir | Out-Null
Copy-Item $source (Join-Path $hooksDir "prepare-commit-msg") -Force
Write-Host "Installed prepare-commit-msg hook in $hooksDir"
