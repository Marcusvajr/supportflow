# Tasks â€” Change 02 Auth Clerk

## 1. ConfiguraÃ§Ã£o da integraÃ§Ã£o Clerk

- [x] 1.1 Criar aplicaÃ§Ã£o/instÃ¢ncia Clerk de desenvolvimento e definir variÃ¡veis `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` e `NEXT_PUBLIC_CLERK_SIGN_IN_URL` em `.env` local, atualizando `.env.example` sem valores reais; verificar com build sem segredos versionados
- [x] 1.2 Adicionar dependÃªncias `@clerk/nextjs` em `apps/web` e SDK de verificaÃ§Ã£o do Clerk em `apps/api`, verificando a API atual do Clerk na documentaÃ§Ã£o (Context7) e confirmando instalaÃ§Ã£o via `npm install`

## 2. Backend â€” mÃ³dulo auth (NestJS)

- [x] 2.1 Criar mÃ³dulo `auth` com guard de autenticaÃ§Ã£o que valida o token do Clerk (`Authorization: Bearer`) e rejeita requisiÃ§Ãµes sem token/invÃ¡lidas/expiradas com `401` Problem Details; verificar com teste unitÃ¡rio do guard cobrindo token vÃ¡lido, ausente e invÃ¡lido
- [x] 2.2 Criar `UsersRepository` (interface + implementaÃ§Ã£o em memÃ³ria com usuÃ¡rios fictÃ­cios ativos/inativos, campos id, externalAuthId, name, email, role, active de `docs/spec.md`) e resolver usuÃ¡rio interno a partir de `externalAuthId`; verificar com teste unitÃ¡rio cobrindo ativo, inexistente e inativo (403)
- [x] 2.3 Implementar `RolesGuard` global com decorador `@Roles('AGENT','SUPERVISOR')`, papel resolvido do registro interno (nunca da claim) e resposta `403` Problem Details; verificar com teste unitÃ¡rio cobrindo papel permitido, negado e divergÃªncia token/registro
- [x] 2.4 Implementar `GET /api/v1/me` retornando 200 com id, nome, e-mail e papel do usuÃ¡rio autenticado e ativo; verificar com teste de integraÃ§Ã£o cobrindo autenticado, sem token (401) e sem papel em endpoint protegido por papel (403)
- [x] 2.5 Registrar logs estruturados de falhas de autenticaÃ§Ã£o/autorizaÃ§Ã£o (sem tokens) e manter `/api/v1/health` pÃºblico; verificar com teste de integraÃ§Ã£o do health check sem token

## 3. Frontend â€” sessÃ£o e rotas privadas (Next.js)

- [x] 3.1 Configurar `ClerkProvider` no layout raiz e `clerkMiddleware` isentando rotas pÃºblicas (`/sign-in`, health), verificando que o health check do frontend nÃ£o quebra
- [x] 3.2 Criar rota `/sign-in` com componente `<SignIn>` e identidade visual SupportFlow, exibindo mensagens de erro do provedor; verificar visualmente em dev e com teste
- [x] 3.3 Proteger rotas privadas (dashboard placeholder pÃ³s-login) redirecionando sem sessÃ£o ao `/sign-in` e retornando ao destino original apÃ³s autenticar; verificar com teste cobrindo acesso sem sessÃ£o, login vÃ¡lido e sessÃ£o expirada
- [x] 3.4 Criar `apiClient` encapsulado que injeta `Authorization: Bearer` do token de sessÃ£o e trata 401 (redireciona ao login) e 403 (tela de acesso indisponÃ­vel); verificar com teste unitÃ¡rio do cliente cobrindo injeÃ§Ã£o de header e tratamento de 401/403
- [x] 3.5 Implementar consumo de `GET /api/v1/me` para exibir usuÃ¡rio autenticado e tela de acesso indisponÃ­vel para usuÃ¡rio inativo; verificar com teste cobrindo usuÃ¡rio ativo e inativo

## 4. Testes E2E (Playwright)

- [ ] 4.1 Criar E2E de login vÃ¡lido redirecionando ao dashboard e sessÃ£o ausente redirecionando ao login; verificar com `npm run test:e2e`
- [ ] 4.2 Criar E2E de usuÃ¡rio autenticado sem acesso interno recebendo mensagem apropriada (acesso indisponÃ­vel); verificar com `npm run test:e2e`

## 5. Qualidade e revisÃ£o final

- [x] 5.1 Executar `npm run lint` em web e api sem erros; verificar saÃ­da dos comandos
- [x] 5.2 Executar `npm run test` (unitÃ¡rio + integraÃ§Ã£o) atingindo cobertura das camadas de auth/users; verificar saÃ­da dos comandos
- [ ] 5.3 Executar `npm run build` e `npm run test:e2e` completos; verificar saÃ­da dos comandos
- [ ] 5.4 Revisar critÃ©rios de aceite: segredo Clerk ausente do frontend, rotas privadas rejeitando token invÃ¡lido, autorizaÃ§Ã£o aplicada no NestJS e fluxo de login exercitado pelo Playwright; verificar checklist contra `specs/auth-clerk/spec.md`
- [ ] 5.5 Confirmar que `.env` nÃ£o foi versionado e nenhuma regra de negÃ³cio foi adicionada ao frontend; verificar com `git status` e revisÃ£o do diff



