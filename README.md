# SupportFlow

Aplicação web para centralização e continuidade de chamados técnicos em provedores de internet, desenvolvida de forma incremental na disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

A proposta é manter o histórico técnico do chamado organizado para que outro atendente consiga entender o que já foi feito e continuar o atendimento sem reconstruir todo o contexto.

## Estado da V3

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
- inspeção local de código com SonarQube;
- auditoria de dependências de produção no CI;
- persistência PostgreSQL gerenciada pelo Supabase;
- cadastro, busca e atualização de clientes fictícios;
- criação e consulta de chamados com protocolo, status, prioridade e resolução;
- registro de observações, testes e diagnósticos;
- linha do tempo com atividades técnicas e eventos de auditoria.

A execução local completa dos testes E2E da Change 02 terminou com:

```text
8 passed
0 failed
```

A inspeção final no SonarQube terminou com **Quality Gate: Passed**, sem novos issues no código analisado, sem Security Hotspots e com duplicação de `0,0%` no novo código. A tela final informou que ainda não havia linhas novas suficientes para calcular cobertura nessa janela de New Code.

Na revisão final de dependências, uma vulnerabilidade transitiva do `multer` foi identificada na versão anterior da plataforma NestJS. O backend foi atualizado para NestJS `12.0.3`, que utiliza a versão corrigida do `multer`. Após a atualização, o CI executou `npm audit --omit=dev --audit-level=high` com **0 vulnerabilidades**, além de lint, testes, build e smoke tests com sucesso.

## Documentação

- [`docs/problem.md`](docs/problem.md) — definição do problema.
- [`docs/prd.md`](docs/prd.md) — requisitos do produto.
- [`docs/spec.md`](docs/spec.md) — especificação técnica.
- [`docs/architecture.md`](docs/architecture.md) — arquitetura.
- [`docs/architecture-models.md`](docs/architecture-models.md) — modelos de contexto, contêineres, componentes, classes e implantação.
- [`docs/lean-canvas.md`](docs/lean-canvas.md) — Lean Canvas do produto.
- [`docs/personas.md`](docs/personas.md) — personas priorizadas.
- [`docs/user-journey.md`](docs/user-journey.md) — jornada do usuário.
- [`docs/story-map.md`](docs/story-map.md) — mapeamento de histórias e releases.
- [`docs/supabase.md`](docs/supabase.md) — persistência, RLS e integração segura do backend com Supabase.
- [`docs/design.md`](docs/design.md) — design system.
- [`docs/auth-clerk.md`](docs/auth-clerk.md) — implementação e testes da autenticação Clerk.
- [`docs/delivery-configuration.md`](docs/delivery-configuration.md) — rastreabilidade das seções **1 a 6** do roteiro de Delivery.
- [`docs/presentation-v2.md`](docs/presentation-v2.md) — histórico da apresentação da V2.
- [`docs/presentation-v3.md`](docs/presentation-v3.md) — roteiro atualizado da V3/final.
- [`docs/final-checklist.md`](docs/final-checklist.md) — checklist dos requisitos da disciplina.
- [`docs/compliance-v2.md`](docs/compliance-v2.md) — requisitos acadêmicos incorporados ao planejamento.
- [`docs/sonarqube.md`](docs/sonarqube.md) — execução e resultado da inspeção de código.
- [`specs/login-flow-test-plan.md`](specs/login-flow-test-plan.md) — plano de testes do login.
- [`specs/login-flow-test-cases.md`](specs/login-flow-test-cases.md) — casos de teste e rastreabilidade.
- [`openspec/roadmap.md`](openspec/roadmap.md) — roadmap incremental e situação atual das changes.

## Publicação

Ambiente de demonstração da entrega incremental:

- Frontend (Vercel): https://supportflow-pi.vercel.app
- API (Render): https://supportflow-api-fu00.onrender.com/api/v1
- Health da API: https://supportflow-api-fu00.onrender.com/api/v1/health

A publicação utiliza variáveis de ambiente gerenciadas pelas plataformas de hospedagem. Segredos e credenciais não são versionados no repositório.

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
- Inspeção de código: SonarQube
- Persistência: PostgreSQL / Supabase
- Integração com banco: Supabase Data API (PostgREST) isolada no backend

## Plataforma e evolução

Nesta V3 também foram concluídos os **containers OCI**, a **Infraestrutura como Código**, a **observabilidade/rastreabilidade** e o **recurso assistivo de IA**. A integração de IA é compatível com provedor OpenAI-compatible e degrada com segurança quando não há credencial configurada.

A única dependência externa não versionada é a credencial de um provedor real de IA, necessária apenas para demonstrar uma resposta gerada ao vivo.

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

As seções **1 a 6** estão executadas e documentadas. A seção 6 inclui os testes com Playwright e a inspeção local com SonarQube.

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

### Changes da V3

- `change-03-customer-management` — implementada e verificada;
- `change-04-ticket-lifecycle` — implementada e verificada;
- `change-05-ticket-activities` — implementada e verificada em código/testes, incluindo RBAC de reatribuição;
- `change-06-dashboard-and-search` — implementada e verificada;
- `change-07-ai-ticket-summary` — implementada e testada; credencial real de provedor permanece externa;
- `change-08-platform-compliance` — implementada e verificada.

O relatório consolidado da bateria final está em [`docs/test-report-v3.md`](docs/test-report-v3.md).

A revisão adicional está em [`docs/revalidation-v3.md`](docs/revalidation-v3.md), com os limites explícitos da validação local e as correções propostas.

## Como validar localmente

### Criar o `.env`

```powershell
Copy-Item .env.example .env
```

As credenciais reais ficam somente no `.env` local, que é ignorado pelo Git.

### Instalar dependências

```powershell
npm ci
```

O `npm ci` usa o `package-lock.json` versionado e reproduz exatamente as versões validadas no CI.

### Executar as verificações

```powershell
npm audit --omit=dev --audit-level=high
npm run lint
npm run test
npm run build
npm run test:e2e
```

O comando `npm run test:e2e` executa também os cenários reais de autenticação e, por isso, exige as contas fictícias de desenvolvimento do Clerk configuradas no `.env`.

No GitHub Actions, o pipeline padrão executa auditoria das dependências de produção, lint, testes unitários/HTTP, build e os smoke tests que não dependem de credenciais externas.

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

### Repetir a inspeção SonarQube

Com Docker e o SonarQube local configurados:

```powershell
.\scripts\start-sonarqube.ps1
.\scripts\run-sonar.ps1
```

O token permanece somente na sessão local e não é versionado.

## Segurança

- `.env` não é versionado;
- `CLERK_SECRET_KEY` não é exposta no frontend;
- autorização é aplicada no backend;
- papéis não são aceitos de dados enviados pelo cliente;
- logs de falha não registram tokens;
- tokens do SonarQube também ficam fora do Git;
- dependências de produção passam por `npm audit` no CI;
- a revisão final do CI registrou **0 vulnerabilidades**;
- o ambiente acadêmico utiliza somente dados fictícios.
