$ErrorActionPreference = "Stop"

Write-Host "Preparando artefatos da entrega incremental v2..."

if (-not (Get-Command openspec -ErrorAction SilentlyContinue)) {
  throw "OpenSpec não encontrado no PATH. Instale/valide o OpenSpec antes de continuar."
}

openspec init --tools antigravity,opencode

& "$PSScriptRoot/setup-agent-skills.ps1"

Write-Host ""
Write-Host "Estruturas esperadas após a inicialização:"
Write-Host "  .agents/"
Write-Host "  .opencode/"
Write-Host "  openspec/"
Write-Host ""
Write-Host "Depois execute: npm install; npm run lint; npm run test; npm run build"
