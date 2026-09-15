# SupportFlow

Aplicação web para centralização e continuidade de chamados técnicos em provedores de internet, desenvolvida de forma incremental na disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

## Documentação

- [`docs/problem.md`](docs/problem.md) — definição do problema.
- [`docs/prd.md`](docs/prd.md) — requisitos do produto.
- [`docs/spec.md`](docs/spec.md) — especificação técnica.
- [`docs/architecture.md`](docs/architecture.md) — arquitetura.
- [`docs/design.md`](docs/design.md) — design system.
- [`docs/auth-clerk.md`](docs/auth-clerk.md) — implementação, arquitetura, fluxo e testes da autenticação Clerk.
- [`docs/delivery-configuration.md`](docs/delivery-configuration.md) — execução documentada das seções **1 a 6** do roteiro de Delivery.
- [`docs/presentation-v2.md`](docs/presentation-v2.md) — apresentação textual da entrega incremental, documentos entregues, achados e observações.
- [`docs/compliance-v2.md`](docs/compliance-v2.md) — adequações da entrega incremental v2 ao regulamento da disciplina.
- [`openspec/roadmap.md`](openspec/roadmap.md) — roadmap incremental de mudanças e situação atual.

## Protótipo

Protótipo criado no Google Stitch.

**Stitch:** https://stitch.withgoogle.com/projects/5301597292888761257

Telas planejadas: login, dashboard, chamados, novo chamado, detalhes do chamado, clientes e detalhes do cliente.

## Stack

- Frontend: Next.js + React + TypeScript
- Backend: Node.js + NestJS + TypeScript
- Banco: PostgreSQL / Supabase
- ORM: Prisma
- Autenticação: Clerk
- CI/CD: GitHub Actions
- Deploy frontend: Vercel
- Observabilidade: Sentry + logs estruturados
- E2E/aceite: Playwright
- Prototipação: Google Stitch
- Agentes: Google Antigravity / OpenCode
- SDD: OpenSpec
- Gateway Open Source AI: OmniRoute + OpenRouter

## Estrutura atual

```text
supportflow/
├── apps/
│   ├── web/
│   └── api/
├── docs/
├── openspec/
│   ├── changes/
│   ├── specs/
│   ├── config.yaml
│   └── roadmap.md
├── scripts/
├── .agents/
├── .github/workflows/
├── AGENTS.md
├── package.json
├── .env.example
├── .gitignore
├── opencode.json
└── README.md
```

## Entrega incremental v2

A v2 desenvolve as seções **1 a 6** do roteiro de Delivery de forma incremental e registra as evidências no próprio repositório.

### Change 01 — fundação do projeto

`change-01-project-foundation` estabeleceu a base técnica do SupportFlow:

- monorepo com npm workspaces;
- frontend inicial em Next.js;
- backend inicial em NestJS;
- health check em `GET /api/v1/health`;
- teste unitário inicial;
- pipeline de CI para verificação estática, testes e build.

### Change 02 — autenticação com Clerk

`change-02-auth-clerk` foi implementada, validada e arquivada no OpenSpec.

A implementação inclui:

- login e logout com Clerk;
- proteção de rotas privadas;
- envio de Bearer token para o backend;
- validação do token no NestJS;
- associação entre identidade Clerk e usuário interno;
- controle de usuários ativos e inativos;
- autorização por papéis `AGENT` e `SUPERVISOR`;
- tratamento de `401` e `403`;
- fluxo de acesso indisponível para usuário inativo;
- testes automatizados com Playwright.

Resultado da validação E2E:

```text
8 passed
0 failed
```

Documentação técnica:

[`docs/auth-clerk.md`](docs/auth-clerk.md)

Apresentação textual da entrega:

[`docs/presentation-v2.md`](docs/presentation-v2.md)

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
NestJS valida token e resolve o usuário interno
  ↓
Ativo → dashboard
Inativo → /access-unavailable
401 → retorno ao login
```

### Próximas changes planejadas

1. `change-03-customer-management`
2. `change-04-ticket-lifecycle`
3. `change-05-ticket-activities`
4. `change-06-dashboard-and-search`
5. `change-07-ai-ticket-summary`
6. `change-08-platform-compliance`

Cada proposta informa escopo, dependências, riscos, lint e testes necessários.

## Conformidade acadêmica

O roadmap contempla:

- testes de unidade, integração e E2E/aceite;
- dois fluxos de negócio ponta a ponta;
- IA assistiva para resumo de contexto técnico;
- evolução para contêineres OCI e Infraestrutura como Código;
- configuração por variáveis de ambiente e código versionado.

A IA planejada é **assistiva**: não altera automaticamente diagnóstico, status, prioridade ou responsável.

A documentação de Delivery apresenta as seções 1 a 6 e a apresentação textual reúne os documentos incrementais, achados e observações do processo.

## Preparação local

### Criar o `.env`

```powershell
Copy-Item .env.example .env
```

As credenciais reais devem existir somente no `.env` local. O arquivo é ignorado pelo Git.

### Inicializar artefatos de agente/OpenSpec no ambiente local

```powershell
./scripts/init-v2.ps1
```

Esse script executa a inicialização do OpenSpec para Antigravity/OpenCode e chama o instalador de skills previsto no roteiro.

### Instalar dependências e validar

```powershell
npm install
npm run lint
npm run test
npm run build
npm run test:e2e
```

### Executar aplicações

Em terminais separados:

```powershell
npm run dev:web
npm run dev:api
```

Ou, para executar frontend e backend juntos:

```powershell
npm run dev
```

Endpoints esperados:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3001`
- health: `http://localhost:3001/api/v1/health`
- usuário autenticado: `http://localhost:3001/api/v1/me`

## Preparação de ambiente já validada

Foram validados localmente durante a preparação:

- Google Antigravity;
- Node.js/npm;
- Git;
- Docker/Docker Compose;
- OpenSpec;
- Playwright;
- OpenCode;
- OmniRoute/OpenRouter;
- MCPs Context7, Playwright Test e Stitch;
- credenciais locais de Vercel, Supabase, Clerk, Context7 e Stitch.

Nenhum valor real de token ou API key é versionado.

## Segurança

- nunca commitar `.env`;
- nunca expor `CLERK_SECRET_KEY` ou credenciais administrativas no frontend;
- usar somente dados fictícios de clientes;
- aplicar autorização no backend;
- manter regras de negócio fora do frontend;
- manter segredos somente em variáveis de ambiente locais ou secrets do CI.