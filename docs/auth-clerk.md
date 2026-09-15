# Autenticação — Change 02

## Configuração local

Os comandos dos workspaces carregam o `.env` da raiz. As variáveis de ambiente já definidas pelo processo têm precedência. O Next.js expõe somente variáveis `NEXT_PUBLIC_*`; chaves secretas são usadas apenas em processos de servidor.

1. Use uma instância **de desenvolvimento** do Clerk com autenticação por e-mail/senha habilitada.
2. Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` e `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` no `.env` ignorado pelo Git.
3. Para verificação local de assinatura, `CLERK_JWT_KEY` pode conter a chave **pública PEM completa** da instância. Deixe-a vazia para consultar o JWKS com `CLERK_SECRET_KEY`. Texto de exemplo não é uma chave válida.
4. Configure `CLERK_AUTHORIZED_PARTIES` e `FRONTEND_ORIGIN` para a origem do navegador. Localmente, os testes usam `http://localhost:3000`.
5. Crie previamente contas fictícias no Clerk. Copie seus IDs `user_…` para `DEMO_AGENT_CLERK_ID`, `DEMO_SUPERVISOR_CLERK_ID` e `DEMO_INACTIVE_CLERK_ID`, conforme o perfil desejado.

Os perfis e o campo `active` são definidos nas fixtures internas de `apps/api/src/users/in-memory-users.repository.ts`. A associação é exclusivamente por ID Clerk; metadados e e-mails recebidos do cliente não concedem acesso. IDs desconhecidos e usuários inativos recebem `403`. IDs duplicados na configuração são rejeitados.

Nesta change, o repositório é **em memória**, conforme o design aprovado: apenas três fixtures acadêmicas, sem CRUD ou persistência. Ele será substituído pela implementação Prisma na evolução planejada. Login não cria nem vincula usuários automaticamente.

## Fluxo

- `/` é a página pública da fundação; a ação **Entrar no SupportFlow** leva ao dashboard.
- `/sign-in` usa o componente oficial do Clerk. Após login, retorna ao destino privado solicitado ou a `/dashboard`.
- `ClerkProvider` fica no layout raiz; `clerkMiddleware` em `src/proxy.ts` e o layout privado verificam a sessão.
- O dashboard consulta `/api/v1/me` com Bearer token obtido do SDK a cada requisição.
- `401` encerra a sessão e direciona ao login; `403` apresenta `/access-unavailable`. Falhas de rede/servidor mostram opção de tentar novamente.
- **Sair da conta** usa o logout do Clerk. Nenhum token é persistido manualmente em storage.

Ausência de configuração não libera rotas privadas. As páginas públicas informam indisponibilidade da autenticação; a API mantém o health público e recusa acesso protegido.

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

## Verificação

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

Os testes unitários e HTTP usam chaves RSA efêmeras, o verificador real do SDK e fixtures isoladas. Não precisam de credenciais externas nem alteram a instância Clerk.

Para os E2E reais, preencha também no `.env`:

- `E2E_CLERK_AGENT_EMAIL` e `E2E_CLERK_AGENT_PASSWORD`: conta correspondente a `DEMO_AGENT_CLERK_ID`.
- `E2E_CLERK_INACTIVE_EMAIL` e `E2E_CLERK_INACTIVE_PASSWORD`: conta correspondente a `DEMO_INACTIVE_CLERK_ID`.

Playwright prepara um Testing Token oficial para evitar bloqueios de automação e percorre a interface real de login. Contas não são criadas pelos testes. Credenciais ausentes falham na preparação, em vez de transformar fluxos não testados em sucesso. Traces ficam desativados para não gravar cookies/tokens.

O projeto Playwright `chromium` cobre apenas a fundação e o acesso sem sessão; `chromium-auth` depende de `clerk-setup` e cobre login, logout, acesso inativo e resposta a `401`. `npm run test:e2e` executa todos. No CI, as mesmas variáveis devem ser fornecidas por secrets/variables do ambiente de teste, nunca por arquivos versionados.
