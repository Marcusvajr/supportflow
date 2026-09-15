# Change 02 — Auth Clerk

## Why

O SupportFlow precisa identificar quem está acessando o sistema antes de liberar qualquer funcionalidade operacional. A autenticação também precisava ficar separada da autorização para que o backend pudesse decidir, de forma confiável, se o usuário interno está ativo e qual papel possui.

## What Changes

- login e logout no frontend com Clerk;
- proteção das rotas privadas;
- envio do token de sessão ao backend;
- validação do token no NestJS;
- resolução do usuário interno pelo `externalAuthId` do Clerk;
- endpoint `GET /api/v1/me`;
- RBAC para `AGENT` e `SUPERVISOR` aplicado no backend;
- tratamento de usuário autenticado, porém inativo;
- tratamento de sessão inválida ou expirada;
- testes unitários, de integração e E2E para os fluxos de autenticação.

## Impact

A mudança adiciona uma fronteira de identidade entre frontend e backend. O Clerk comprova a identidade; o SupportFlow continua sendo a fonte de verdade para situação do usuário e papel interno. As changes seguintes podem reutilizar os guards e o contexto de usuário autenticado.

## Dependências

- `change-01-project-foundation`.

## Riscos

- **Configuração incorreta de chaves/issuer — Médio.** Mitigação: variáveis de ambiente e testes de integração.
- **Autorização implementada apenas na UI — Médio.** Mitigação: decisão obrigatória no backend.
- **Usuário autenticado sem vínculo interno — Médio.** Mitigação: negar acesso com `403` até que exista associação interna válida.

## Lint

- obrigatório para frontend e backend.

## Testes unitários

- validação de papéis;
- resolução de usuário ativo/inativo;
- comportamento dos guards;
- cliente HTTP do frontend.

## Testes de integração

- `GET /api/v1/me` autenticado;
- token ausente/inválido;
- acesso negado por papel;
- health público.

## Testes E2E/aceite

- login válido redireciona ao dashboard;
- sessão ausente redireciona ao login;
- usuário inativo recebe tela de acesso indisponível;
- logout encerra a sessão;
- `401` após expiração retorna ao login.

## Critérios de aceite

- segredo Clerk não é exposto no frontend;
- rotas privadas rejeitam requisições sem token válido;
- autorização é aplicada no NestJS;
- papel é obtido do registro interno, não de metadados fornecidos pelo cliente;
- fluxo real de login pode ser exercitado pelo Playwright;
- `.env` permanece fora do versionamento.
