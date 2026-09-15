# Change 02 — Auth Clerk

## Objetivo

Adicionar autenticação delegada ao Clerk e autorização no backend para os papéis `AGENT` e `SUPERVISOR`.

## Escopo funcional

- login e logout no frontend;
- proteção das rotas privadas;
- envio do token ao backend;
- validação do token no NestJS;
- resolução do usuário interno;
- endpoint `GET /api/v1/me`;
- guard/policy de RBAC para `AGENT` e `SUPERVISOR`;
- tratamento de usuário autenticado, porém inativo.

## Dependências

- `change-01-project-foundation`.

## Riscos

- **Configuração incorreta de chaves/issuer — Médio.** Mitigação: variáveis de ambiente e teste de integração.
- **Autorização implementada apenas na UI — Médio.** Mitigação: decisão obrigatória no backend.

## Lint

- obrigatório para frontend e backend.

## Testes unitários

- validação de papéis;
- resolução de usuário ativo/inativo;
- comportamento do guard.

## Testes de integração

- `GET /me` autenticado;
- token ausente/inválido;
- acesso negado por papel.

## Testes E2E/aceite

- login válido redireciona ao dashboard;
- sessão ausente redireciona ao login;
- usuário sem acesso recebe mensagem apropriada.

## Critérios de aceite

- segredo Clerk não é exposto no frontend;
- rotas privadas rejeitam requisições sem token válido;
- autorização é aplicada no NestJS;
- fluxo de login pode ser exercitado pelo Playwright.
