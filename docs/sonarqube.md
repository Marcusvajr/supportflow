# SonarQube — inspeção de código

Esta etapa complementa a **seção 6 do roteiro de Delivery**. A configuração foi preparada no repositório, mas o scan precisa ser executado localmente porque depende de um servidor SonarQube e de um token gerado no ambiente do aluno.

## O que já está versionado

- `sonar-project.properties` — escopo da análise;
- `scripts/start-sonarqube.ps1` — inicializa o SonarQube via Docker;
- `scripts/run-sonar.ps1` — executa o scanner sem gravar token no comando do repositório;
- variáveis de exemplo em `.env.example`;
- configuração do MCP SonarQube em `opencode.json`, deixada desabilitada até existir token local.

## 1. Atualizar o projeto local

```powershell
git pull
```

## 2. Iniciar o SonarQube

Com o Docker Desktop aberto:

```powershell
.\scripts\start-sonarqube.ps1
```

Depois acesse:

```text
http://localhost:9000
```

Na primeira execução, entre com as credenciais iniciais do SonarQube, altere a senha quando solicitado e crie um projeto local para o SupportFlow.

Sugestão de chave do projeto:

```text
supportflow
```

## 3. Gerar o token

No SonarQube, gere um token para a análise local. O token é segredo e **não deve ser colado em arquivos versionados**.

No PowerShell da sessão atual:

```powershell
$env:SONARQUBE_TOKEN="SEU_TOKEN_LOCAL"
$env:SONARQUBE_HOST="http://localhost:9000"
$env:SONARQUBE_PROJECT_KEY="supportflow"
```

O valor real do token não deve aparecer em prints, commits ou documentação.

## 4. Instalar o scanner

Caso ainda não esteja instalado:

```powershell
npm install -g @sonar/scan
```

## 5. Executar a análise

```powershell
.\scripts\run-sonar.ps1
```

Ao final, abra novamente o projeto no SonarQube e revise:

- bugs;
- vulnerabilidades;
- security hotspots;
- code smells;
- duplicações;
- quality gate, quando disponível.

## 6. Registrar a evidência

Para a entrega, basta registrar o resultado sem expor o token. Exemplos de evidência útil:

- print da página do projeto no SonarQube;
- quantidade de issues por categoria;
- principais achados e correções realizadas;
- resultado do Quality Gate, se disponível.

Depois do scan, este documento pode receber uma pequena seção **Resultado da análise** com a data e os achados realmente observados.

## MCP SonarQube

O `opencode.json` contém um servidor `sonarqube` preparado com a imagem oficial:

```text
sonarsource/sonarqube-mcp
```

Ele permanece desabilitado por padrão para não quebrar o ambiente de quem ainda não possui servidor/token local.

Para usar o MCP no Docker Desktop, as variáveis esperadas são:

```text
SONARQUBE_TOKEN=
SONARQUBE_MCP_URL=http://host.docker.internal:9000
SONARQUBE_PROJECT_KEY=supportflow
```

Depois de configurar as variáveis no ambiente, altere `enabled` para `true` no bloco `sonarqube` do `opencode.json` e reinicie o OpenCode.

## Situação nesta revisão

A parte versionável da inspeção de código está pronta. **A execução do scan local ainda precisa ser feita antes da entrega final/ZIP para que a seção 6 tenha evidência completa de SonarQube.**
