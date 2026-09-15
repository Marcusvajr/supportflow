# Plano de Testes — Fluxo de Login com Clerk

## Objetivo

Validar o fluxo de autenticação da Change 02 de ponta a ponta, garantindo que identidade, sessão e autorização interna funcionem de forma consistente entre Next.js, Clerk e NestJS.

Referências principais:

- `openspec/specs/auth-clerk/spec.md`
- `docs/auth-clerk.md`
- `docs/spec.md`
- `apps/web/tests/auth.spec.ts`
- `apps/web/tests/access.spec.ts`
- `apps/api/tests/auth.integration.test.ts`

## Escopo

O plano cobre:

- acesso sem sessão;
- login válido;
- consulta de `/api/v1/me`;
- usuário interno ativo;
- usuário autenticado, porém inativo;
- logout;
- token/sessão inválida ou expirada;
- health checks públicos;
- separação entre identidade Clerk e autorização interna.

Não cobre nesta change:

- cadastro de usuários;
- recuperação de senha;
- MFA;
- organizações/multi-tenancy;
- persistência Prisma de usuários.

## Pré-condições

Para os testes E2E autenticados:

- frontend em `http://localhost:3000`;
- backend em `http://localhost:3001`;
- instância Clerk de desenvolvimento configurada;
- conta fictícia AGENT vinculada a `DEMO_AGENT_CLERK_ID`;
- conta fictícia INACTIVE vinculada a `DEMO_INACTIVE_CLERK_ID`;
- variáveis E2E presentes somente no `.env` local;
- `.env` fora do versionamento.

Os testes unitários e HTTP não dependem da instância Clerk externa; usam fixtures e chaves efêmeras.

## Cenários

| ID | Cenário | Resultado esperado | Tipo |
|---|---|---|---|
| AUTH-E2E-01 | Visitante abre `/dashboard` sem sessão | Redirecionamento para `/sign-in` | E2E |
| AUTH-E2E-02 | AGENT realiza login válido | Dashboard é exibido e `/me` retorna o usuário interno | E2E |
| AUTH-E2E-03 | AGENT faz logout | Sessão é encerrada e rota privada volta a exigir login | E2E |
| AUTH-E2E-04 | Usuário Clerk vinculado a perfil INACTIVE entra | Backend retorna acesso indisponível e frontend abre `/access-unavailable` | E2E |
| AUTH-E2E-05 | `/me` retorna `401` durante sessão | Frontend encerra a sessão e retorna a `/sign-in` | E2E |
| AUTH-API-01 | `/me` sem Bearer token | `401` Problem Details | Integração |
| AUTH-API-02 | Token inválido/expirado | `401` sem dados de negócio | Integração |
| AUTH-API-03 | Usuário inexistente ou inativo | `403` | Integração |
| AUTH-API-04 | AGENT tenta recurso de SUPERVISOR | `403` mesmo que o cliente tente informar outro papel | Integração |
| AUTH-API-05 | Health check sem autenticação | `200` | Integração/E2E |
| AUTH-SEC-01 | Falha de autenticação gera log | Log contém correlação/status e não contém token | Integração |

## Dados de teste

Somente dados fictícios são usados.

Perfis necessários:

- **AGENT ativo** — consegue autenticar e acessar o dashboard;
- **INACTIVE** — autentica no Clerk, mas não recebe acesso funcional;
- **SUPERVISOR** — usado nos testes de RBAC quando necessário.

Senhas e tokens nunca fazem parte deste arquivo nem do Git.

## Estratégia de execução

### Verificações rápidas

```powershell
npm run lint
npm run test
npm run build
```

### E2E completo em ambiente local configurado

```powershell
npm run test:e2e
```

Resultado validado na Change 02:

```text
8 passed
0 failed
```

### CI padrão

O GitHub Actions executa os smoke tests que não dependem das credenciais externas do Clerk:

```text
npx playwright test --project=chromium
```

## Critérios de aprovação

O fluxo é considerado aprovado quando:

- nenhuma rota privada é liberada sem sessão válida;
- o backend valida o Bearer token;
- `role` e `active` vêm do registro interno;
- usuário inativo não acessa a aplicação;
- logout e `401` encerram o fluxo autenticado corretamente;
- health checks continuam públicos;
- nenhum segredo é versionado ou registrado em logs;
- os testes aplicáveis terminam sem falhas.

## Rastreabilidade

A implementação dos cenários E2E está principalmente em:

- `apps/web/tests/access.spec.ts`
- `apps/web/tests/auth.spec.ts`
- `apps/web/tests/clerk.setup.ts`

A cobertura de backend está em:

- `apps/api/tests/auth.test.ts`
- `apps/api/tests/auth.integration.test.ts`
- `apps/api/tests/roles.test.ts`
- `apps/api/tests/health.test.ts`
