$ErrorActionPreference = 'Stop'

if (-not (Get-Command sonar -ErrorAction SilentlyContinue)) {
  throw 'Scanner Sonar não encontrado. Instale com: npm install -g @sonar/scan'
}

if ([string]::IsNullOrWhiteSpace($env:SONARQUBE_TOKEN)) {
  throw 'Defina SONARQUBE_TOKEN no ambiente antes de executar o scan.'
}

$hostUrl = if ([string]::IsNullOrWhiteSpace($env:SONARQUBE_HOST)) {
  'http://localhost:9000'
} else {
  $env:SONARQUBE_HOST
}

$projectKey = if ([string]::IsNullOrWhiteSpace($env:SONARQUBE_PROJECT_KEY)) {
  'supportflow'
} else {
  $env:SONARQUBE_PROJECT_KEY
}

Write-Host "Executando análise SonarQube em $hostUrl para o projeto $projectKey..."

& sonar `
  "-Dsonar.host.url=$hostUrl" `
  "-Dsonar.token=$env:SONARQUBE_TOKEN" `
  "-Dsonar.projectKey=$projectKey"

if ($LASTEXITCODE -ne 0) {
  throw "A análise SonarQube terminou com código $LASTEXITCODE."
}

Write-Host 'Análise concluída. Abra o projeto no SonarQube para revisar os achados.'
