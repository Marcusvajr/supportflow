# Change 01 — Project Foundation

## Objetivo

Criar a estrutura inicial executável do SupportFlow como monorepo, estabelecendo a base técnica para as mudanças seguintes.

## Escopo funcional

- configurar npm workspaces;
- criar `apps/web` com Next.js + React + TypeScript;
- criar `apps/api` com NestJS + TypeScript;
- disponibilizar health check em `/api/v1/health`;
- criar página inicial do frontend com estado da fundação do projeto;
- configurar scripts raiz para `dev`, `lint`, `test` e `build`;
- configurar pipeline inicial no GitHub Actions.

## Fora do escopo

- autenticação Clerk;
- Prisma/Supabase;
- regras de chamados;
- dashboards reais;
- IA;
- deploy de produção.

## Dependências

Nenhuma mudança funcional anterior. Depende apenas dos pré-requisitos de ambiente já preparados nas seções 1 a 4 do Delivery.

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

- smoke test da inicialização da API deverá ser adicionado quando o harness HTTP estiver disponível.

### Testes E2E

Não obrigatório nesta mudança, pois ainda não existe fluxo de negócio completo. O Playwright será aplicado nas mudanças com interface e fluxo funcional.

## Critérios de aceite

- estrutura `apps/web` e `apps/api` disponível;
- frontend compila;
- backend compila;
- health check responde com estado saudável;
- scripts raiz executam as validações dos workspaces;
- CI executa instalação, lint, testes e build;
- nenhuma credencial real é adicionada ao GitHub.
