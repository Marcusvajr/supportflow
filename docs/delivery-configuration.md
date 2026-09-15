# Delivery — Seções 1 a 6

Este documento registra a execução das **seções 1 a 6** do roteiro de Delivery aplicada ao projeto **SupportFlow**, incluindo a preparação complementar do ambiente Open Source AI.

O objetivo desta entrega incremental é manter rastreáveis: ambiente, agente, mudanças OpenSpec, implementação, validação e evidências de qualidade.

---

## 1. Visão geral do fluxo

Resultados previstos pelo roteiro e adotados no SupportFlow:

- roadmap de mudanças;
- propostas de mudança;
- planos e casos de teste;
- incrementos de produto;
- verificação dos incrementos implementados.

Participantes previstos:

- Designer UX;
- Desenvolvedor.

Ferramentas utilizadas no fluxo:

- Google Antigravity e OpenCode;
- OpenSpec para Spec-Driven Development;
- Playwright para automação E2E;
- GitHub;
- Clerk;
- Context7;
- Google Stitch;
- OmniRoute/OpenRouter no fluxo Open Source AI.

---

## 2. Orientações gerais e pré-requisitos

Foram preparados e validados localmente:

- Google Antigravity IDE;
- Node.js e npm;
- Git;
- Docker e Docker Compose;
- OpenSpec;
- Playwright;
- OpenCode;
- contas e acessos para GitHub, Vercel, Supabase, Clerk, Context7 e Google Stitch.

O desenvolvimento seguiu o ciclo **pesquisar → planejar → implementar → validar**, com mudanças incrementais e escopo controlado.

As credenciais reais permanecem apenas no arquivo `.env` local e não são versionadas.

### Ambiente Open Source AI

O SupportFlow também foi configurado com:

- OmniRoute executado via Docker;
- OpenRouter como provider;
- Prompt Compression habilitado;
- perfil global `Stacked` (`RTK → Caveman`);
- OpenCode conectado ao OmniRoute;
- MCPs Context7, Playwright Test e Stitch conectados.

Endpoint local do OmniRoute utilizado pelo OpenCode:

```text
http://localhost:20128/v1
```

---

## 3. Configuração do projeto

### Documentação geral

A documentação principal está disponível em `docs/`:

```text
docs/
├── architecture.md
├── design.md
├── prd.md
├── problem.md
├── spec.md
├── auth-clerk.md
└── presentation-v2.md
```

### Variáveis de ambiente

O repositório versiona apenas `.env.example`. O `.env` real é local e protegido pelo `.gitignore`.

Exemplo de criação local:

```powershell
Copy-Item .env.example .env
```

Principais grupos de configuração:

- Context7 e Stitch;
- Vercel e Supabase;
- Clerk;
- OmniRoute;
- portas do frontend/backend;
- URL pública da API.

### README

O `README.md` funciona como porta de entrada da entrega, contendo:

- problema e objetivo;
- stack;
- estrutura do projeto;
- status das changes;
- comandos de execução e validação;
- links para roadmap, documentação técnica e apresentação textual.

---

## 4. Configuração do agente de IA

### AGENTS.md

O arquivo `AGENTS.md` foi configurado com diretrizes específicas do SupportFlow, incluindo:

- prioridades de segurança, arquitetura e testes;
- stack tecnológica;
- limites arquiteturais;
- regras de negócio no backend;
- comandos principais;
- qualidade e testes;
- governança e autonomia no terminal;
- uso do Context7 MCP;
- referências à documentação do projeto;
- aprendizado contínuo após mudanças relevantes.

### Skills

A estrutura `.agents/skills/` foi criada e contém skills aplicáveis ao projeto, incluindo capacidades para:

- Clerk;
- backend/NestJS;
- frontend;
- arquitetura;
- Docker;
- CI/CD;
- qualidade de código;
- OpenSpec.

### MCP Servers

No ambiente de desenvolvimento foram validados:

- Context7;
- Playwright Test;
- Google Stitch.

Os três MCPs foram exibidos como conectados durante a validação no OpenCode.

---

## 5. Criação e execução de mudanças com OpenSpec

O OpenSpec foi configurado no repositório e o planejamento incremental está registrado em:

`openspec/roadmap.md`

As mudanças foram dimensionadas para que tamanho, complexidade e risco não ultrapassem nível médio.

### Change 01 — Project Foundation

A primeira change criou a estrutura inicial do produto:

- monorepo com npm workspaces;
- frontend Next.js;
- backend NestJS;
- health check;
- testes iniciais;
- CI base.

### Change 02 — Auth Clerk

A segunda change foi proposta, implementada, verificada e arquivada.

Principais entregas:

- login e logout com Clerk;
- proteção de rotas privadas;
- Bearer token entre frontend e backend;
- validação de token no NestJS;
- associação da identidade Clerk ao usuário interno;
- usuários ativos e inativos;
- RBAC com `AGENT` e `SUPERVISOR`;
- tratamento de `401`, `403` e indisponibilidade;
- testes unitários, integração e E2E relacionados à autenticação.

Arquivamento:

`openspec/changes/archive/2026-09-14-change-02-auth-clerk/`

Especificação consolidada:

`openspec/specs/auth-clerk/spec.md`

### Próximas mudanças planejadas

- `change-03-customer-management`
- `change-04-ticket-lifecycle`
- `change-05-ticket-activities`
- `change-06-dashboard-and-search`
- `change-07-ai-ticket-summary`
- `change-08-platform-compliance`

O fluxo adotado para as mudanças é:

```text
proposta → implementação → verificação → arquivamento
```

---

## 6. Verificação de mudanças

### Verificação manual

O projeto disponibiliza os comandos de qualidade previstos no fluxo:

```powershell
npm run lint
npm run test
npm run build
npm run dev
npm run test:e2e
```

Aplicação local:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Health:   http://localhost:3001/api/v1/health
Usuário:  http://localhost:3001/api/v1/me
```

### Playwright

O Playwright está configurado no monorepo e foi utilizado para verificar os fluxos da fundação e da autenticação.

A autenticação E2E utiliza contas de desenvolvimento do Clerk configuradas por variáveis locais, sem versionar credenciais.

Cenários cobertos incluem:

- visitante redirecionado de rota privada para login;
- health do frontend acessível;
- fundação do frontend;
- health do backend;
- preparação do ambiente real do Clerk;
- login de usuário ativo;
- acesso de usuário inativo;
- sessão expirada/retorno `401`.

Resultado final da execução E2E da Change 02:

```text
8 passed
0 failed
```

Esse resultado confirmou o fluxo real de autenticação após os ajustes de ambiente e testes.

---

## Evidências da entrega incremental

| Item | Evidência no repositório | Situação |
|---|---|---|
| Seções 1–3 | `docs/delivery-configuration.md` e configuração raiz | Concluído |
| Seção 4 | `AGENTS.md`, `.agents/skills/`, MCPs configurados | Concluído |
| Seção 5 | `openspec/roadmap.md`, changes e archive | Concluído |
| Seção 6 | Playwright, testes e comandos de verificação | Concluído |
| Fundação | `change-01-project-foundation` e código base | Implementado |
| Autenticação | `change-02-auth-clerk` | Implementado, testado e arquivado |
| E2E Auth | `apps/web/tests/` | 8 testes aprovados |
| Segurança | `.env` ignorado e segredos fora do Git | Validado |

---

## Checklist de segurança

- [x] `.env` ignorado pelo Git.
- [x] `.env` não versionado.
- [x] `.env.example` sem segredos reais.
- [x] chaves secretas não expostas no frontend.
- [x] credenciais de testes E2E somente no ambiente local/CI.
- [x] autorização aplicada no backend.

---

## Conclusão

A entrega incremental registra e demonstra a execução das seções **1 a 6** do roteiro de Delivery no SupportFlow.

A fundação do projeto foi criada na Change 01 e a autenticação foi implementada de ponta a ponta na Change 02, com validação real via Clerk e Playwright. O roadmap mantém as próximas mudanças planejadas para evolução incremental do produto.