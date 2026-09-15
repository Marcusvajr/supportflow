# Design — Change 02 Auth Clerk

## Context

A fundação (`change-01`) entregou o monorepo com `apps/web` (Next.js 16, App Router) e `apps/api` (NestJS 11) com health check em `api/v1`, CI com lint/test/build e smoke tests do Playwright. Nesta change ainda não há banco de dados nem Prisma; o modelo `User` (`externalAuthId`, `role`, `active`) está definido em `docs/spec.md` e é representado por um repositório em memória com dados fictícios.

Fluxo de referência: Next.js → Clerk → token → `Authorization: Bearer` → NestJS valida → usuário interno → regra de autorização. A autenticação comprova a identidade; a autorização continua sendo responsabilidade do backend.

## Goals / Non-Goals

**Goals:**

- autenticação no frontend via Clerk;
- proteção das rotas privadas no recurso de servidor;
- validação do token e resolução de usuário interno no NestJS;
- `GET /api/v1/me` funcional conforme contrato da API do MVP;
- guards/policies RBAC reutilizáveis para `AGENT`/`SUPERVISOR`;
- tratamento do caso "autenticado porém inativo" com resposta `403` e tela apropriada;
- tratamento consistente de sessão expirada e logout.

**Non-Goals:**

- CRUD de usuários ou sincronização automática Clerk → banco;
- migrações do Prisma, previstas para uma mudança posterior;
- rate limiting, MFA customizado ou multi-tenancy;
- gestão de convites ou self-signup; os usuários de teste são provisionados previamente no Clerk e nas fixtures acadêmicas.

## Decisions

### D1 — Integração Clerk no Next.js com `@clerk/nextjs`

O SDK oficial é usado com `ClerkProvider`, página `/sign-in` e `clerkMiddleware`. A proteção efetiva das rotas privadas fica no layout de servidor do grupo `(private)` por meio de `auth.protect()`, mantendo a checagem próxima ao recurso protegido.

O `proxy.ts` mantém a integração necessária do Clerk e exceções técnicas de health/icon, mas não é a única barreira de segurança.

- *Alternativa: proteger tudo apenas por matcher no middleware* — descartada para evitar depender de correspondência de caminho como única barreira de autenticação.
- *Alternativa: autenticação própria* — contraria a decisão arquitetural de identidade delegada.

### D2 — Validação do Bearer token no NestJS

A API usa `@clerk/backend` para verificar o token recebido em `Authorization: Bearer`. O verificador confere assinatura, issuer, sessão e origem autorizada antes de aceitar a identidade.

- *Alternativa: confiar em headers ou dados enviados pelo frontend* — insegura, porque o cliente pode ser manipulado.
- *Alternativa: validar apenas no frontend* — viola a regra de autorização no backend.

### D3 — `externalAuthId` como única associação de identidade

O backend usa o `sub` validado do token Clerk como `externalAuthId` e procura o usuário interno por esse identificador. O papel não é aceito de claims, metadados ou valores enviados pelo cliente. `role` e `active` vêm somente do registro interno do SupportFlow.

- *Alternativa: confiar em role do token* — descartada para impedir divergência entre identidade externa e autorização interna.
- *Alternativa: sincronizar usuário automaticamente por webhook* — amplia o escopo e depende de infraestrutura adicional.

### D4 — Porta de repositório antes do Prisma

O módulo `auth` depende de `UsersRepository`. Nesta change, a implementação é em memória com fixtures fictícias de usuários ativos/inativos. A futura implementação Prisma poderá substituir essa porta sem alterar o contrato de autenticação.

- *Alternativa: introduzir Prisma nesta change* — ampliaria o escopo antes da etapa de persistência.

### D5 — RBAC com metadados e guard

`@Roles('AGENT', 'SUPERVISOR')` + `RolesGuard` aplicam a autorização no NestJS. `SUPERVISOR` herda as permissões de `AGENT`. Endpoints sem papel específico continuam exigindo autenticação, exceto recursos marcados explicitamente como públicos.

- *Alternativa: biblioteca de autorização mais complexa* — desnecessária para os dois papéis atuais.

### D6 — Cliente HTTP encapsulado no frontend

Uma única camada `apiClient` injeta o Bearer token e centraliza os tratamentos de `401` e `403`.

- *Alternativa: `fetch` espalhado pelos componentes* — aumentaria o risco de chamadas sem token ou tratamento inconsistente.

## Risks / Trade-offs

- **Configuração incorreta de chaves/issuer** → variáveis de ambiente, falha fechada e testes de configuração.
- **Usuário autenticado sem registro interno** → acesso negado com `403`; não há criação automática.
- **Repositório em memória divergir do banco futuro** → interface espelha os campos definidos em `docs/spec.md` para facilitar substituição por Prisma.
- **Sessão expirada gerar loop de navegação** → `401` encerra a sessão no frontend antes de retornar ao login.
- **Segredo ou token aparecer em log** → erros do SDK não são propagados diretamente; logs de falha não registram token.

## Migration Plan

- adicionar as dependências oficiais do Clerk e as variáveis de ambiente em `.env.example`;
- configurar `ClerkProvider`, login e proteção do grupo privado;
- adicionar os módulos `auth` e `users` no backend;
- habilitar `/api/v1/me`, guards e RBAC;
- validar primeiro por testes unitários/HTTP e depois pelo fluxo E2E real;
- rollback possível removendo os módulos de autenticação sem comprometer o health check público da fundação.

## Final State

A implementação final foi validada localmente com **8 testes E2E aprovados**. Os testes autenticados usam contas fictícias de desenvolvimento do Clerk. O CI padrão executa os smoke tests sem segredos; o fluxo E2E completo é executado em ambiente com as credenciais de teste configuradas.
