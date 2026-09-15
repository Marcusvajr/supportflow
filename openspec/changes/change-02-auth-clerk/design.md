# Design — Change 02 Auth Clerk

## Context

A fundação (`change-01`) entregou o monorepo com `apps/web` (Next.js 16, App Router) e `apps/api` (NestJS 11) com health check em `api/v1`, CI com lint/test/build e E2E smoke do Playwright. Não há banco de dados nem Prisma ainda; o modelo `User` (`externalAuthId`, `role`, `active`) está definido em `docs/spec.md` e o módulo `users/` é previsto pela arquitetura, mas inexistente no código.

Fluxo de referência em `docs/architecture.md`: Next.js → Clerk → token → `Authorization: Bearer` → NestJS valida → serviço de negócio. A autorização é responsabilidade exclusiva do backend; o frontend apenas reflete permissões para UX.

## Goals / Non-Goals

**Goals:**

- Autenticação completa no frontend via Clerk com proteção de rotas privadas.
- Validação de token e resolução de usuário interno no NestJS.
- `GET /api/v1/me` funcional conforme contrato da API do MVP.
- Guards/policies RBAC reutilizáveis para `AGENT`/`SUPERVISOR` que as changes 03–06 consumirão.
- Tratamento do caso "autenticado porém inativo" com resposta 403 e tela apropriada.

**Non-Goals:**

- Criação de CRUD de usuários ou sincronização automática Clerk → banco (associação de usuário é provisionada por seed/fixture acadêmica).
- Migrações do Prisma (o Prisma entra na change-03; aqui a resolução de usuário usa porta de repositório sem implementação de persistência).
- Rate limiting, MFA customizado, organização/multi-tenancy do Clerk.
- Gestão de convites ou self-signup; os usuários de teste são criados no dashboard do Clerk.

## Decisions

### D1 — Integração Clerk no Next.js com `@clerk/nextjs`

Uso do SDK oficial (`ClerkProvider` no layout raiz, `clerkMiddleware`, `<SignIn>`/`<SignedIn>`/`<SignedOut>`) com rotas `/sign-in` hospedadas na aplicação.

- *Alternativa: Sign-in por popup/redirecionamento hospedado no Clerk* — descartada por complicar os testes E2E locais e reduzir controle visual descrito em `docs/design.md`.
- *Alternativa: auth própria* — contraria a decisão de arquitetura de identidade delegada.

### D2 — Validação no NestJS com verificação de token no backend

A API valida o Bearer token por middleware/guard do módulo `auth` (integração com a API Backend do Clerk para verificar a sessão/token), sem confiar em headers não verificados.

- *Alternativa: `clerk-sdk-node` deprecated* — descartada.
- *Alternativa: validar apenas no frontend* — viola "autorização é aplicada no NestJS".

### D3 — `externalAuthId` como chave de associação

O módulo `users` expõe `UsersService.findByExternalAuthId(clerkUserId)`. Em `claims` do token, o papel (`AGENT`/`SUPERVISOR`) é lido de metadados públicos do Clerk, mas o backend revalida contra o registro interno do usuário (fonte de verdade do papel e do `active`).

- *Alternativa: confiar apenas na claim de papel do token* — permite papel divergente do registro interno e impede desativar acesso de forma confiável.
- *Alternativa: sincronizar usuário via webhook* — adianta dependência de webhook/infra; fica para evolução futura.

### D4 — Porta de repositório para `UsersService` antes do Prisma

O módulo `auth` depende de uma interface `UsersRepository` com implementação em memória (fixtures fictícias de usuários ativos/inativos) nesta change. Quando o Prisma chegar (change-03), a implementação é substituída sem alterar o módulo de auth.

- *Alternativa: introduzir Prisma + migration nesta change* — amplia escopo e antecipa mudança de schema prevista para a change-03 (que requer auth pronto).

### D5 — RBAC com decorador de metadados + guard

`@Roles('AGENT', 'SUPERVISOR')` + `RolesGuard` globalmente habilitado via `APP_GUARD` após o guard de autenticação. Sem papéis no endpoint, exige apenas autenticação. Erros seguem Problem Details (401/403) já no formato padrão da API.

- *Alternativa: `CASL`* — excedente ao MVP de dois papéis fixos.

### D6 — Cliente HTTP encapsulado no frontend

Camada única `apiClient` que injeta `Authorization: Bearer <session token>` e centraliza tratamento de 401/403 (redirecionar ao login / tela de acesso indisponível).

- *Alternativa: fetch espalhado pelos componentes* — risco de requisição sem token e tratamento inconsistente.

## Risks / Trade-offs

- [Configuração incorreta de chaves/issuer] → chaves somente por variáveis de ambiente (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`), `.env.example` atualizado, teste de integração cobrindo 401/403, CI valida builds sem segredos.
- [Usuários sem registro interno no primeiro login] → sem self-signup: usuários de teste são criados no Clerk e no repositório interno por seed; `GET /me` e rotas negam com 403 para `externalAuthId` desconhecido, coberto por teste.
- [Porta em memória diverge do banco futuro] → contrato da interface `UsersRepository` espelha os campos de `docs/spec.md` (id, externalAuthId, name, email, role, active), minimizando a troca na change-03.
- [Middleware do Clerk interfere no health check] → rotas públicas (`/api/health`, `/sign-in`) explicitamente isentadas na configuração do middleware e cobertas pelo smoke test existente.
- [Divergência entre papel do token e do registro interno] → backend usa sempre o papel do registro interno resolvido, nunca da claim; teste cobre a divergência.

## Migration Plan

- Adicionar dependências (`@clerk/nextjs`, SDK de verificação do Clerk no backend) e variáveis em `.env.example`; nenhum dado existente é migrado.
- Rollback: remover módulo `auth` do `AppModule` e providers do layout; a fundação segue funcionando pois o health check permanece público.
- CI: segredos não são usados em build; os testes de integração usam mocks de verificação de token.

## Open Questions

- Nenhuma que bloqueie specs ou tarefas; a escolha exata do SDK de verificação do backend pode ser confirmada na implementação consultando a documentação atual do Clerk (Context7), sem alterar os contratos definidos aqui.
