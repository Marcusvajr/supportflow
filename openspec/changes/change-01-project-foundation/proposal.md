# Change 01 — Project Foundation

## Why

O SupportFlow precisava de uma base executável e verificável antes de receber regras de negócio. Esta mudança cria a fundação técnica do monorepo e reduz o risco de cada incremento seguinte precisar resolver novamente estrutura, comandos, testes e automação.

## What Changes

- configurar npm workspaces;
- criar `apps/web` com Next.js + React + TypeScript;
- criar `apps/api` com NestJS + TypeScript;
- disponibilizar health check em `/api/v1/health`;
- criar página inicial do frontend com estado da fundação do projeto;
- configurar scripts raiz para `dev`, `lint`, `test`, `test:e2e` e `build`;
- configurar pipeline inicial no GitHub Actions.

## Impact

A mudança afeta a estrutura raiz do repositório, os dois workspaces, os comandos de desenvolvimento e o pipeline de CI. Não introduz regras de chamados, persistência ou autenticação.

## Fora do escopo

- autenticação Clerk;
- Prisma/Supabase;
- regras de chamados;
- dashboards reais;
- IA;
- deploy de produção.

## Dependências

Nenhuma mudança funcional anterior. Depende apenas dos pré-requisitos de ambiente preparados nas etapas iniciais do Delivery.

## Riscos

- **Incompatibilidade de versões Node/dependências — Médio.** Mitigação: versões declaradas, TypeScript estrito e CI.
- **Fundação excessivamente acoplada — Baixo.** Mitigação: separar `web` e `api` desde o início.
- **Segredos versionados — Baixo.** Mitigação: manter `.env` ignorado e somente `.env.example` no repositório.

## Validações obrigatórias

### Lint/verificação estática

- `npm run lint`

### Testes unitários

- health controller do backend.

### Testes de integração

- smoke test da inicialização da API.

### Testes E2E

Nesta fundação, o Playwright valida os smoke tests disponíveis. Fluxos autenticados e de negócio entram nas mudanças correspondentes.

## Critérios de aceite

- estrutura `apps/web` e `apps/api` disponível;
- frontend compila;
- backend compila;
- health check responde com estado saudável;
- scripts raiz executam as validações dos workspaces;
- CI executa instalação, lint, testes, build e smoke tests;
- nenhuma credencial real é adicionada ao GitHub.
