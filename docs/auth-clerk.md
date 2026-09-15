# Autenticação — Change 02

## Resumo da entrega

A **Change 02** implementa a autenticação do SupportFlow com Clerk no frontend e validação de sessão no backend NestJS.

A entrega inclui:

- login e logout com Clerk;
- proteção de rotas privadas;
- envio de Bearer token do frontend para a API;
- validação do token no backend;
- resolução do usuário interno pelo `externalAuthId` do Clerk;
- controle de acesso para usuários ativos e inativos;
- suporte aos papéis `AGENT` e `SUPERVISOR`;
- tratamento de sessão expirada (`401`) e acesso indisponível (`403`);
- testes unitários, de integração e E2E com Playwright.

Ao final da validação local, o fluxo E2E foi executado com sucesso: **8 testes passaram e 0 falharam**.

A change foi concluída e arquivada no OpenSpec em:

`openspec/changes/archive/2026-09-14-change-02-auth-clerk/`

A especificação consolidada está em:

`openspec/specs/auth-clerk/spec.md`

## Visão da arquitetura

O Clerk é responsável pela autenticação e pela sessão do usuário no frontend. Após o login, o frontend obtém o token da sessão pelo SDK oficial e o envia para a API usando o cabeçalho:

```http
Authorization: Bearer <token>
```

No backend, o NestJS valida o token e usa o claim `sub` do Clerk como `externalAuthId`. Esse identificador é usado para localizar o usuário interno do SupportFlow.

A autenticação e a autorização permanecem separadas: o Clerk confirma a identidade; a aplicação decide se o usuário está ativo e qual papel possui. O papel não é aceito de metadados do navegador nem de claims usadas como fonte de autorização.

Fluxo simplificado:

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
Busca usuário interno pelo externalAuthId
  ↓
Usuário ativo → dashboard
Usuário inativo → /access-unavailable
Sessão inválida/expirada → /sign-in
```

## Configuração local

Os comandos dos workspaces carregam o `.env` da raiz. As variáveis de ambiente já definidas pelo processo têm precedência. O Next.js expõe somente variáveis `NEXT_PUBLIC_*`; chaves secretas são usadas apenas em processos de servidor.

1. Use uma instância **de desenvolvimento** do Clerk com autenticação por e-mail/senha habilitada.
2. Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` e `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` no `.env` ignorado pelo Git.
3. `CLERK_JWT_KEY` é opcional. Quando vazia, o backend pode validar o token usando a configuração suportada pelo Clerk com `CLERK_SECRET_KEY`. Se uma chave PEM for usada, ela precisa ser carregada integralmente e não como texto multilinha quebrado no `.env`.
4. Configure `CLERK_AUTHORIZED_PARTIES` e `FRONTEND_ORIGIN` para a origem do navegador. Localmente, os testes usam `http://localhost:3000`.
5. Crie previamente contas fictícias no Clerk. Copie seus IDs `user_…` para `DEMO_AGENT_CLERK_ID`, `DEMO_SUPERVISOR_CLERK_ID` e `DEMO_INACTIVE_CLERK_ID`, conforme o perfil desejado.

Os perfis e o campo `active` são definidos nas fixtures internas de `apps/api/src/users/in-memory-users.repository.ts`. A associação é exclusivamente por ID Clerk; metadados e e-mails recebidos do cliente não concedem acesso. IDs desconhecidos e usuários inativos recebem `403`. IDs duplicados na configuração são rejeitados.

Nesta change, o repositório é **em memória**, conforme o design aprovado: apenas fixtures acadêmicas, sem CRUD ou persistência. Ele será substituído pela implementação Prisma na evolução planejada. Login não cria nem vincula usuários automaticamente.

## Fluxo funcional

- `/` é a página pública da fundação; a ação **Entrar no SupportFlow** leva ao dashboard.
- `/sign-in` usa o componente oficial do Clerk. Após login, retorna ao destino privado solicitado ou a `/dashboard`.
- `ClerkProvider` fica no layout raiz e `clerkMiddleware` inicializa a integração do Clerk no `proxy.ts`.
- O grupo de rotas privadas faz a proteção no próprio layout de servidor com `auth.protect()`, mantendo a checagem próxima ao recurso protegido.
- O dashboard consulta `/api/v1/me` com Bearer token obtido do SDK a cada requisição.
- `401` encerra a sessão e direciona ao login.
- `403` apresenta `/access-unavailable`.
- Falhas de rede/servidor mostram opção de tentar novamente.
- **Sair da conta** usa o logout do Clerk.
- Nenhum token é persistido manualmente em storage.

Ausência de configuração não libera rotas privadas. A API mantém o health público e recusa acesso protegido quando a autenticação não pode ser validada.

## API

`GET /api/v1/me` exige uma sessão Clerk válida e um usuário interno ativo:

```json
{ "id": "demo-agent", "name": "Ana Atendente", "email": "ana@example.test", "role": "AGENT" }
```

- `200`: somente `id`, `name`, `email`, `role`; `Cache-Control: no-store`.
- `401`: credencial ausente, inválida ou expirada; `WWW-Authenticate: Bearer`.
- `403`: usuário sem acesso ativo ou sem papel autorizado.
- `503`: verificador sem configuração necessária.
- Erros usam `application/problem+json`, com `type`, `title`, `status`, `detail`, `instance` e correlação em `X-Request-Id`.

Os guards globais autenticam antes de verificar `@Roles(...)`. `SUPERVISOR` herda permissões de `AGENT`. Rotas sem metadados de papel ainda exigem autenticação e usuário ativo. `@Public()` é uma exceção explícita, usada no health.

## Cenários demonstrados

### 1. Usuário sem sessão

Ao acessar uma rota privada, o usuário é direcionado ao login.

### 2. Usuário AGENT ativo

Após autenticação, o usuário acessa o dashboard e a aplicação consulta `/api/v1/me` para recuperar os dados internos do atendente.

### 3. Usuário INACTIVE

O Clerk autentica a identidade, mas o backend identifica o usuário interno como inativo e bloqueia o acesso funcional. O frontend apresenta `/access-unavailable`.

### 4. Sessão expirada ou inválida

A API responde `401`, a sessão é encerrada no frontend e o usuário retorna para `/sign-in`.

### 5. Logout

O botão **Sair da conta** encerra a sessão pelo SDK do Clerk e retorna o usuário ao fluxo público de autenticação.

## Verificação

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

Resultado E2E validado localmente:

```text
8 passed
0 failed
```

Os testes unitários e HTTP usam chaves RSA efêmeras, o verificador real do SDK e fixtures isoladas. Não precisam de credenciais externas nem alteram a instância Clerk.

Para os E2E reais, preencha também no `.env`:

- `E2E_CLERK_AGENT_EMAIL` e `E2E_CLERK_AGENT_PASSWORD`: conta correspondente a `DEMO_AGENT_CLERK_ID`.
- `E2E_CLERK_INACTIVE_EMAIL` e `E2E_CLERK_INACTIVE_PASSWORD`: conta correspondente a `DEMO_INACTIVE_CLERK_ID`.

Os testes automatizados cobrem login, logout, acesso sem sessão, usuário inativo, health checks e comportamento após `401`. As credenciais do Clerk usadas nos E2E reais permanecem somente no ambiente local (ou em um ambiente dedicado que tenha secrets configurados) e nunca são versionadas.

### CI

O GitHub Actions padrão executa lint, testes unitários/HTTP, build e os smoke tests do Playwright que não precisam de credenciais externas:

```text
npx playwright test --project=chromium
```

O comando local `npm run test:e2e` continua sendo a validação completa, incluindo os cenários autenticados com Clerk.

## Como explicar esta etapa

> O SupportFlow usa o Clerk para confirmar a identidade do usuário. O frontend mantém a sessão e envia o token para a API. O backend valida esse token e localiza o usuário interno pelo ID do Clerk. A partir daí, o próprio SupportFlow decide se o usuário está ativo e qual papel possui. Assim, autenticação e autorização ficam separadas. O fluxo foi testado de ponta a ponta e a execução local final terminou com 8 testes E2E aprovados.

## Segurança

- `.env` não é versionado;
- `CLERK_SECRET_KEY` permanece somente no servidor;
- o frontend recebe apenas variáveis `NEXT_PUBLIC_*` apropriadas;
- a autorização é aplicada no backend;
- papéis não são aceitos do cliente como fonte de verdade;
- usuários não são criados automaticamente durante o login;
- nenhuma credencial real é incluída nesta documentação.
