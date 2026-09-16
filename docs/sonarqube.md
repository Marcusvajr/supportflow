# SonarQube — inspeção de código

Esta etapa complementa a **seção 6 do roteiro de Delivery**. O scan é executado localmente porque depende de um servidor SonarQube e de um token gerado no ambiente do aluno.

## O que está versionado

- `sonar-project.properties` — escopo da análise;
- `scripts/start-sonarqube.ps1` — inicializa o SonarQube via Docker;
- `scripts/run-sonar.ps1` — executa o scanner sem gravar token no repositório;
- variáveis de exemplo em `.env.example`;
- configuração do MCP SonarQube em `opencode.json`, deixada desabilitada por padrão.

## Como repetir a análise

### 1. Atualizar o projeto local

```powershell
git pull
```

### 2. Iniciar o SonarQube

Com o Docker Desktop aberto:

```powershell
.\scripts\start-sonarqube.ps1
```

A interface local fica disponível em:

```text
http://localhost:9000
```

### 3. Configurar o token somente na sessão local

O token do projeto deve permanecer fora do repositório.

Uma forma segura de carregá-lo no PowerShell é:

```powershell
$secureToken = Read-Host "Cole o token do SonarQube" -AsSecureString
$env:SONARQUBE_TOKEN = [System.Net.NetworkCredential]::new("", $secureToken).Password
$env:SONARQUBE_HOST = "http://localhost:9000"
$env:SONARQUBE_PROJECT_KEY = "supportflow"
Remove-Variable secureToken
```

### 4. Instalar o scanner, se necessário

```powershell
npm install -g @sonar/scan
```

O script aceita os comandos disponíveis nas instalações atuais do scanner, incluindo `sonar-scanner-npm`.

### 5. Executar a análise

```powershell
.\scripts\run-sonar.ps1
```

## Resultado observado em 15/09/2026

O primeiro scan identificou três apontamentos de baixo impacto:

1. preferência por `String#replaceAll()` em `apps/api/src/auth/auth.config.ts`;
2. props do componente `CurrentUserPanel` deveriam ser somente leitura;
3. preferência por raw string no trecho que normaliza quebras de linha da configuração do Clerk.

Os três pontos foram revisados e corrigidos no código. Após novo scan, o painel do SonarQube apresentou:

- **Quality Gate: Passed**;
- **New issues: 0**;
- **Accepted issues: 0**;
- **Security Hotspots: 0**;
- **Duplications em New Code: 0,0%**;
- cobertura em New Code: o SonarQube informou que **não havia linhas novas suficientes para calcular a cobertura** naquela janela.

O resultado final demonstra que a inspeção não foi tratada apenas como formalidade: os apontamentos encontrados foram analisados, corrigidos e verificados em nova execução.

## Observação sobre cobertura

A aplicação possui testes unitários, HTTP e E2E, incluindo uma execução local da Change 02 com `8 passed` e `0 failed`.

O painel final do SonarQube não calculou cobertura para o pequeno conjunto de linhas classificadas como New Code. Isso não deve ser interpretado como ausência de testes; são métricas diferentes. Caso o projeto evolua para exigir cobertura consolidada no SonarQube, o próximo passo é gerar relatórios LCOV durante a execução dos testes e informá-los em `sonar.javascript.lcov.reportPaths` / `sonar.typescript.lcov.reportPaths`, conforme a ferramenta de cobertura adotada.

## MCP SonarQube

O `opencode.json` contém um servidor `sonarqube` preparado com a imagem oficial:

```text
sonarsource/sonarqube-mcp
```

Ele permanece desabilitado por padrão para não quebrar o ambiente de quem não possui servidor/token local configurado.

Variáveis esperadas pelo MCP:

```text
SONARQUBE_TOKEN=
SONARQUBE_MCP_URL=http://host.docker.internal:9000
SONARQUBE_PROJECT_KEY=supportflow
```

O token real nunca deve ser versionado, exibido em documentação ou incluído em prints da entrega.

## Situação final

A inspeção SonarQube da seção 6 foi **executada e concluída**, os achados de baixo impacto foram corrigidos e o último scan registrado apresentou **Quality Gate Passed**.
