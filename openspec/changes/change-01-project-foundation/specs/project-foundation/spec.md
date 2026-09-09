# Delta Spec — Project Foundation

## Requirement: Monorepo executável

O projeto MUST possuir uma estrutura inicial de monorepo com workspaces separados para frontend e backend.

### Scenario: Estrutura disponível

- **Given** o repositório SupportFlow
- **When** um desenvolvedor consulta a raiz do projeto
- **Then** deve encontrar `apps/web` e `apps/api`
- **And** os dois aplicativos devem ser coordenados por npm workspaces.

## Requirement: Frontend base

O frontend MUST usar Next.js, React e TypeScript e MUST funcionar como camada de apresentação.

### Scenario: Página inicial

- **Given** o frontend executando
- **When** o usuário acessa a rota raiz
- **Then** deve visualizar a identificação do SupportFlow
- **And** nenhuma regra de negócio deve ser persistida no frontend.

## Requirement: Backend base

O backend MUST usar NestJS e TypeScript e MUST expor um health check versionado.

### Scenario: Health check saudável

- **Given** a API executando
- **When** é realizada uma requisição `GET /api/v1/health`
- **Then** a API deve responder com status de serviço saudável
- **And** identificar o serviço como `supportflow-api`.

## Requirement: Configuração externa

Portas e prefixos MUST ser configuráveis por variável de ambiente com valores padrão seguros para desenvolvimento.

### Scenario: Valores padrão

- **Given** ausência de `GLOBAL_PREFIX` e `BACKEND_PORT`
- **When** a API é iniciada
- **Then** deve usar `api/v1` como prefixo
- **And** `3001` como porta.

## Requirement: Validação contínua

A fundação MUST possuir automação de CI para executar verificação estática, testes e build.

### Scenario: Pull request ou push em main

- **Given** uma alteração enviada ao GitHub
- **When** o workflow de CI é acionado
- **Then** deve instalar dependências
- **And** executar `npm run lint`
- **And** executar `npm run test`
- **And** executar `npm run build`.
