$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker nao encontrado. Inicie o Docker Desktop antes de executar este script.'
}

$existing = docker ps -a --filter 'name=^/sonarqube$' --format '{{.Names}}'

if ($existing -eq 'sonarqube') {
  $running = docker ps --filter 'name=^/sonarqube$' --format '{{.Names}}'
  if ($running -ne 'sonarqube') {
    docker start sonarqube | Out-Null
    Write-Host 'Container sonarqube iniciado.'
  } else {
    Write-Host 'Container sonarqube ja esta em execucao.'
  }
} else {
  docker run -d `
    --name sonarqube `
    -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true `
    -p 9000:9000 `
    sonarqube:latest | Out-Null
  Write-Host 'Container sonarqube criado e iniciado.'
}

Write-Host 'Aguarde o SonarQube ficar pronto e acesse http://localhost:9000.'
Write-Host 'Na primeira execucao, configure o projeto local e gere um token antes do scan.'
