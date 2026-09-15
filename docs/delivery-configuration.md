# Delivery — Seções 1 a 6

Este documento registra como as **seções 1 a 6** do roteiro de Delivery foram aplicadas ao **SupportFlow**. Ele funciona como mapa da entrega: ambiente, configuração do agente, OpenSpec, implementação e verificação.

## 1. Visão geral do fluxo

O fluxo adotado no projeto é incremental:

```text
entender o problema
      ↓
planejar uma change
      ↓
implementar
      ↓
verificar
      ↓
arquivar quando concluída
```

Resultados previstos pelo roteiro e presentes no repositório:

- roadmap de mudanças;
- propostas OpenSpec;
- design, specs e tasks das mudanças;
- incrementos de produto;
- testes e verificação dos incrementos.

Papéis previstos no roteiro:

- Designer UX;
- Desenvolvedor.

Ferramentas usadas nesta etapa:

- Google Antigravity e OpenCode;
- OpenSpec;
- Playwright;
- GitHub e GitHub Actions;
- Clerk;
- Context7;
- Google Stitch;
- OmniRoute/OpenRouter no ambiente Open Source AI.

## 2. Orientações gerais e pré-requisitos

Foram preparados e validados localmente:

- Google Antigravity IDE;
- Node.js e npm;
- Git;
- Docker e Docker Compose;
- OpenSpec;
- Playwright;
- OpenCode;
- contas/acessos para GitHub, Vercel, Supabase, Clerk, Context7 e Google Stitch.

As credenciais reais ficam somente no `.env` local e não são versionadas.

### Ambiente Open Source AI

Também foram configurados:

- OmniRoute via Docker;
- OpenRouter como provider;
- Prompt Compression;
- perfil `Stacked` (`RTK → Caveman`);
- OpenCode conectado ao OmniRoute;
- MCPs Context7, Playwright Test e Stitch.

Endpoint local do OmniRoute:

```text
http://localhost:20128/v1
```

## 3. Configuração do projeto

### Documentos principais

```text
docs/
├── problem.md
├── prd.md
├── spec.md
├── architecture.md
├── design.md
├── auth-clerk.md
├── compliance-v2.md
├── delivery-configuration.md
└── presentation-v2.md
```

### Variáveis de ambiente

O repositório contém apenas `.env.example`. Para criar o arquivo local:

```powershell
Copy-Item .env.example .env
```

O `.gitignore` protege o `.env`, e a revisão final confirmou que ele não está rastreado pelo Git.

Os grupos de configuração incluem:

- Context7 e Stitch;
- Vercel e Supabase;
- Clerk;
- OmniRoute;
- portas do frontend/backend;
- URL da API;
- observabilidade prevista.

### README

O `README.md` resume o estado atual da entrega e separa tecnologias já usadas das tecnologias que ainda pertencem às próximas changes. Isso evita apresentar Prisma, Supabase, Sentry ou IaC como se já estivessem implementados.

## 4. Configuração do agente de IA

### AGENTS.md

O `AGENTS.md` registra diretrizes do SupportFlow para agentes de desenvolvimento, incluindo:

- segurança;
- arquitetura;
- stack;
- regras de negócio no backend;
- comandos do projeto;
- testes e qualidade;
- uso de Context7;
- limites de autonomia;
- referências aos documentos do projeto.

### Skills e workflows

A estrutura `.agents/` contém skills e workflows instalados para tarefas relacionadas a:

- Clerk;
- NestJS/backend;
- frontend;
- arquitetura;
- Docker;
- CI/CD;
- revisão de código;
- OpenSpec.

### MCP Servers

No OpenCode foram validados como conectados:

- Context7;
- Playwright Test;
- Google Stitch.

## 5. Criação e execução de mudanças com OpenSpec

O planejamento está em:

`openspec/roadmap.md`

As propostas utilizam a estrutura `Why`, `What Changes` e `Impact`, além de dependências, riscos, testes e critérios de aceite.

### Change 01 — Project Foundation

Status: **implementada**.

Entregou:

- monorepo com npm workspaces;
- frontend Next.js;
- backend NestJS;
- health check;
- scripts de validação;
- testes iniciais;
- CI base.

### Change 02 — Auth Clerk

Status: **implementada, verificada e arquivada**.

Entregou:

- login e logout;
- proteção das rotas privadas;
- Bearer token entre frontend e backend;
- validação do token no NestJS;
- associação por `externalAuthId`;
- usuários ativos/inativos;
- RBAC `AGENT` / `SUPERVISOR`;
- tratamento de `401` e `403`;
- testes unitários, HTTP e E2E.

Archive:

`openspec/changes/archive/2026-09-14-change-02-auth-clerk/`

Spec consolidada:

`openspec/specs/auth-clerk/spec.md`

### Próximas changes

Continuam planejadas, sem serem apresentadas como implementadas:

- `change-03-customer-management`;
- `change-04-ticket-lifecycle`;
- `change-05-ticket-activities`;
- `change-06-dashboard-and-search`;
- `change-07-ai-ticket-summary`;
- `change-08-platform-compliance`.

## 6. Verificação das mudanças

### Comandos locais

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

Aplicação local:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Health:   http://localhost:3001/api/v1/health
Usuário:  http://localhost:3001/api/v1/me
```

### Testes da autenticação

O Playwright valida tanto smoke tests quanto os cenários reais de autenticação. Os E2E autenticados usam contas fictícias da instância de desenvolvimento do Clerk, configuradas somente no ambiente local.

Cenários verificados incluem:

- visitante sem sessão redirecionado ao login;
- health do frontend;
- fundação do frontend;
- health do backend;
- preparação do Clerk;
- login de usuário ativo;
- usuário inativo em `/access-unavailable`;
- logout;
- sessão expirada e retorno `401`.

Execução local final:

```text
8 passed
0 failed
```

### GitHub Actions

O CI padrão executa:

- instalação das dependências;
- lint/verificação estática;
- testes unitários e HTTP;
- build;
- smoke tests Playwright sem credenciais externas.

O fluxo autenticado completo não é executado no CI padrão porque depende de contas Clerk de desenvolvimento. Ele continua disponível por `npm run test:e2e` em ambiente configurado.

## Evidências da entrega

| Item | Evidência | Situação |
|---|---|---|
| Seções 1–3 | configuração raiz, documentos e ambiente | Concluído |
| Seção 4 | `AGENTS.md`, `.agents/`, MCPs | Concluído |
| Seção 5 | `openspec/roadmap.md`, changes e archive | Concluído |
| Seção 6 | Playwright, testes e CI | Concluído |
| Fundação | `change-01-project-foundation` | Implementada |
| Autenticação | archive da `change-02-auth-clerk` | Implementada e arquivada |
| E2E local | `apps/web/tests/` | 8 aprovados, 0 falhas |
| Segurança | `.env` ignorado e segredos fora do Git | Validado |

## Checklist de segurança

- [x] `.env` ignorado pelo Git.
- [x] `.env` não versionado.
- [x] `.env.example` sem segredos reais.
- [x] `CLERK_SECRET_KEY` não exposta no frontend.
- [x] credenciais E2E reais mantidas fora do repositório.
- [x] autorização aplicada no backend.
- [x] role interno não confiado ao navegador.
- [x] logs de falha sem tokens.

## Conclusão

As seções **1 a 6** do Delivery estão representadas por artefatos verificáveis no repositório. A Change 01 criou a fundação e a Change 02 levou a autenticação até um fluxo testado de ponta a ponta. As demais changes permanecem planejadas no roadmap e serão tratadas nos próximos incrementos.
