# Tasks — Change 02 Auth Clerk

## 1. Configuração da integração Clerk

- [x] 1.1 Criar aplicação/instância Clerk de desenvolvimento e definir variáveis `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` e `NEXT_PUBLIC_CLERK_SIGN_IN_URL` em `.env` local, atualizando `.env.example` sem valores reais; verificar com build sem segredos versionados.
- [x] 1.2 Adicionar dependências `@clerk/nextjs` em `apps/web` e SDK de verificação do Clerk em `apps/api`, verificando a API atual do Clerk na documentação e confirmando instalação via `npm install`.

## 2. Backend — módulo auth (NestJS)

- [x] 2.1 Criar módulo `auth` com guard de autenticação que valida o token do Clerk (`Authorization: Bearer`) e rejeita requisições sem token, inválidas ou expiradas com `401` Problem Details; verificar com teste unitário do guard cobrindo token válido, ausente e inválido.
- [x] 2.2 Criar `UsersRepository` (interface + implementação em memória com usuários fictícios ativos/inativos, campos id, externalAuthId, name, email, role, active de `docs/spec.md`) e resolver usuário interno a partir de `externalAuthId`; verificar com teste unitário cobrindo ativo, inexistente e inativo (`403`).
- [x] 2.3 Implementar `RolesGuard` global com decorador `@Roles('AGENT','SUPERVISOR')`, papel resolvido do registro interno e resposta `403` Problem Details; verificar com teste unitário cobrindo papel permitido, negado e divergência entre token e registro.
- [x] 2.4 Implementar `GET /api/v1/me` retornando `200` com id, nome, e-mail e papel do usuário autenticado e ativo; verificar com teste de integração cobrindo autenticado, sem token (`401`) e sem papel em endpoint protegido (`403`).
- [x] 2.5 Registrar logs estruturados de falhas de autenticação/autorização sem tokens e manter `/api/v1/health` público; verificar com teste de integração do health check sem token.

## 3. Frontend — sessão e rotas privadas (Next.js)

- [x] 3.1 Configurar `ClerkProvider`, `clerkMiddleware` e proteção das rotas privadas no layout de servidor, mantendo login e health públicos.
- [x] 3.2 Criar rota `/sign-in` com componente `<SignIn>` e identidade visual SupportFlow, exibindo mensagens de erro do provedor; verificar visualmente em desenvolvimento e com teste.
- [x] 3.3 Proteger rotas privadas redirecionando usuários sem sessão para `/sign-in` e retornando ao fluxo privado após autenticar; verificar com teste cobrindo acesso sem sessão, login válido e sessão expirada.
- [x] 3.4 Criar `apiClient` encapsulado que injeta `Authorization: Bearer` do token de sessão e trata `401` (retorno ao login) e `403` (tela de acesso indisponível); verificar com teste unitário do cliente.
- [x] 3.5 Implementar consumo de `GET /api/v1/me` para exibir usuário autenticado e tela de acesso indisponível para usuário inativo; verificar com teste cobrindo usuário ativo e inativo.

## 4. Testes E2E (Playwright)

- [x] 4.1 Criar E2E de login válido redirecionando ao dashboard e sessão ausente redirecionando ao login; validado com `npm run test:e2e`.
- [x] 4.2 Criar E2E de usuário autenticado sem acesso interno recebendo mensagem apropriada em `/access-unavailable`; validado com `npm run test:e2e`.

## 5. Qualidade e revisão final

- [x] 5.1 Executar `npm run lint` em web e api sem erros.
- [x] 5.2 Executar `npm run test` (unitário + integração) cobrindo as camadas de auth/users.
- [x] 5.3 Executar `npm run build` e `npm run test:e2e` completos; execução local final dos E2E: **8 passed, 0 failed**.
- [x] 5.4 Revisar critérios de aceite: segredo Clerk ausente do frontend, rotas privadas rejeitando token inválido, autorização aplicada no NestJS e fluxo de login exercitado pelo Playwright.
- [x] 5.5 Confirmar que `.env` não foi versionado e nenhuma regra de negócio foi adicionada ao frontend; verificado com `git status`, `git check-ignore` e revisão do diff.

> A Change 02 foi arquivada após implementação e validação. Os E2E autenticados usam contas fictícias de desenvolvimento do Clerk e credenciais mantidas apenas no ambiente local; o CI padrão executa smoke tests sem depender desses segredos.
