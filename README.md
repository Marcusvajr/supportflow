# SupportFlow

Aplicação web para centralização e continuidade de chamados técnicos em provedores de internet, desenvolvida de forma incremental na disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

A proposta é manter o histórico técnico do chamado organizado para que outro atendente consiga entender o que já foi feito e continuar o atendimento sem reconstruir todo o contexto.

## Estado desta entrega

Nesta entrega incremental já estão implementados:

- fundação do monorepo com frontend e backend;
- health checks;
- pipeline de CI;
- autenticação com Clerk;
- proteção das rotas privadas;
- validação de Bearer token no NestJS;
- associação entre identidade Clerk e usuário interno;
- RBAC com `AGENT` e `SUPERVISOR`;
- tratamento de usuário ativo/inativo, `401` e `403`;
- testes unitários, de integração e E2E da autenticação;
- plano e casos de teste do fluxo de login;
- configuração versionável para inspeção com SonarQube.

A execução local completa dos testes E2E da Change 02 terminou com:

```text
8 passed
0 failed
```

### Pendência antes do ZIP final

A única etapa da seção 6 que ainda depende do computador local é **executar o scan do SonarQube**, pois ele exige servidor Docker local e token gerado no próprio SonarQube. O repositório já contém configuração, scripts e instruções em [`docs/sonarqube.md`](docs/sonarqube.md).

## Documentação

- [`docs/problem.md`](docs/problem.md) — definição do problema.
- [`docs/prd.md`](docs/prd.md) — requisitos do produto.
- [`docs/spec.md`](docs/spec.md) — especificação técnica.
- [`docs/architecture.md`](docs/architecture.md) — arquitetura.
- [`docs/design.md`](docs/design.md) — design system.
- [`docs/auth-clerk.md`](docs/auth-clerk.md) — implementação e testes da autenticação Clerk.
- [`docs/delivery-configuration.md`](docs/delivery-configuration.md) — rastreabilidade das seções **1 a 6** do roteiro de Delivery.
- [`docs/presentation-v2.md`](docs/presentation-v2.md) — apoio textual para apresentação da entrega, com dificuldades e achados reais do desenvolvimento.
- [`docs/compliance-v2.md`](docs/compliance-v2.md) — requisitos acadêmicos incorporados ao planejamento.
- [`docs/sonarqube.md`](docs/sonarqube.md) — preparação e execução da inspeção de código.
- [`specs/login-flow-test-plan.md`](specs/login-flow-test-plan.md) — plano de testes do login.
- [`specs/login-flow-test-cases.md`](specs/login-flow-test-cases.md) — casos de teste e rastreabilidade.
- [`openspec/roadmap.md`](openspec/roadmap.md) — roadmap incremental e situação atual das changes.

## Protótipo

Protótipo criado no Google Stitch.

**Stitch:** https://stitch.withgoogle.com/projects/5301597292888761257

Telas planejadas: login, dashboard, chamados, novo chamado, detalhes do chamado, clientes e detalhes do cliente.

## Tecnologias utilizadas nesta entrega

- Frontend: Next.js + React + TypeScript
- Backend: Node.js + NestJS + TypeScript
- Autenticação: Clerk
- CI: GitHub Actions
- Testes E2E/aceite: Playwright
- Prototipação: Google Stitch
- Spec-Driven Development: OpenSpec
- Agentes/ferramentas de apoio: Google Antigravity + OpenCode
- Ambiente Open Source AI: OmniRoute + OpenRouter
- Inspeção de código: SonarQube (configurado; scan local a executar antes da entrega final)

## Tecnologias previstas nas próximas changes

As tecnologias abaixo fazem parte da arquitetura e do roadmap, mas ainda não devem ser interpretadas como funcionalidades concluídas nesta entrega:

- PostgreSQL / Supabase;
- Prisma;
- Vercel para publicação;
- Sentry;
- containers OCI da aplicação;
- Infraestrutura como Código;
- IA assistiva para resumo de contexto técnico.

## Estrutura atual

```text
supportflow/
├── apps/
│   ├── web/
│   └── api/
├── docs/
├── specs/
├── openspec/
│   ├── changes/
│   ├── specs/
│   ├── config.yaml
│   └── roadmap.md
├── scripts/
├── .agents/
├── .opencode/
├── .github/workflows/
├── AGENTS.md
├── sonar-project.properties
├── package.json
├── .env.example
├── .gitignore
├── opencode.json
└── README.md
```

## Entrega incremental v2

As seções **1 a 5** estão executadas e documentadas. Na seção **6**, a parte de Playwright está concluída e a parte de SonarQube está preparada para a execução local final.

### Change 01 — Project Foundation

`change-01-project-foundation` criou a base técnica:

- npm workspaces;
- frontend Next.js;
- backend NestJS;
- health check em `GET /api/v1/health`;
- testes iniciais;
- pipeline de CI.

Status: **implementada**.

### Change 02 — Auth Clerk

`change-02-auth-clerk` implementou autenticação e autorização:

- login e logout;
- proteção de rotas privadas;
- Bearer token entre frontend e backend;
- validação de token no NestJS;
- usuário interno resolvido por `externalAuthId`;
- usuários ativos e inativos;
- papéis `AGENT` e `SUPERVISOR`;
- tratamento de `401` e `403`;
- testes automatizados com Playwright.

Status: **implementada, validada e arquivada**.

Artefatos arquivados:

`openspec/changes/archive/2026-09-14-change-02-auth-clerk/`

Especificação consolidada:

`openspec/specs/auth-clerk/spec.md`

### Fluxo de autenticação

```text
Usuário
  ↓
/sign-in
  ↓
Clerk autentica e cria a sessão
  ↓
Frontend obtém token
  ↓
GET /api/v1/me + Bearer token
  ↓
NestJS valida token
  ↓
Busca usuário interno por externalAuthId
  ↓
Ativo → dashboard
Inativo → /access-unavailable
401 → sessão encerrada e retorno ao login
```

### Próximas changes

1. `change-03-customer-management`
2. `change-04-ticket-lifecycle`
3. `change-05-ticket-activities`
4. `change-06-dashboard-and-search`
5. `change-07-ai-ticket-summary`
6. `change-08-platform-compliance`

Essas changes estão planejadas e não são apresentadas como funcionalidades já concluídas.

## Como validar localmente

### Criar o `.env`

```powershell
Copy-Item .env.example .env
```

As credenciais reais ficam somente no `.env` local, que é ignorado pelo Git.

### Instalar dependências

```powershell
npm install
```

### Executar as verificações

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

O comando `npm run test:e2e` executa também os cenários reais de autenticação e, por isso, exige as contas fictícias de desenvolvimento do Clerk configuradas no `.env`.

No GitHub Actions, o pipeline padrão executa os smoke tests que não dependem dessas credenciais externas.

### Executar a aplicação

```powershell
npm run dev
```

Ou em terminais separados:

```powershell
npm run dev:web
npm run dev:api
```

Endpoints locais:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3001`
- health: `http://localhost:3001/api/v1/health`
- usuário autenticado: `http://localhost:3001/api/v1/me`

## Segurança

- `.env` não é versionado;
- `CLERK_SECRET_KEY` não é exposta no frontend;
- autorização é aplicada no backend;
- papéis não são aceitos de dados enviados pelo cliente;
- logs de falha não registram tokens;
- tokens do SonarQube também ficam fora do Git;
- o ambiente acadêmico utiliza somente dados fictícios.
