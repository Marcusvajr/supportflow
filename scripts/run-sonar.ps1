$ErrorActionPreference = 'Stop'

$scannerCandidates = @(
  'sonar',
  'sonar-scanner',
  'sonar-scanner-npm.cmd',
  'sonar-scanner-npm'
)

$scanner = $null
foreach ($candidate in $scannerCandidates) {
  $scanner = Get-Command $candidate -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($scanner) {
    break
  }
}

if (-not $scanner) {
  throw 'Scanner Sonar nao encontrado. Instale com: npm install -g @sonar/scan'
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

$scannerCommand = if (-not [string]::IsNullOrWhiteSpace($scanner.Source)) {
  $scanner.Source
} else {
  $scanner.Name
}

Write-Host "Scanner encontrado: $($scanner.Name)"
Write-Host "Executando analise SonarQube em $hostUrl para o projeto $projectKey..."

& $scannerCommand `
  "-Dsonar.host.url=$hostUrl" `
  "-Dsonar.token=$env:SONARQUBE_TOKEN" `
  "-Dsonar.projectKey=$projectKey"

if ($LASTEXITCODE -ne 0) {
  throw "A analise SonarQube terminou com codigo $LASTEXITCODE."
}

Write-Host 'Analise concluida. Abra o projeto no SonarQube para revisar os achados.'
