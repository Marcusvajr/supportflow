# Verificação — Change 02 Auth Clerk

Este relatório registra a verificação realizada após a implementação da Change 02. Ele consolida as evidências reais de execução usadas antes e depois do arquivamento.

## Escopo verificado

- autenticação via Clerk no frontend;
- proteção de rotas privadas;
- validação de Bearer token no backend;
- resolução de usuário interno por `externalAuthId`;
- usuário ativo e inativo;
- RBAC `AGENT` / `SUPERVISOR`;
- endpoint `GET /api/v1/me`;
- `401`, `403` e health público;
- logout e sessão expirada;
- ausência de segredos no Git.

## Validações de código

### Lint / TypeScript

Executado nos workspaces web e api sem erros.

### Testes unitários e HTTP

A suíte automatizada cobre, entre outros pontos:

- apiClient e tratamento de `401`/`403`;
- tokens válidos, inválidos e expirados;
- assinatura, issuer e origem autorizada;
- usuário interno inexistente/inativo;
- papéis e herança de `SUPERVISOR`;
- health público;
- logs de falha sem tokens.

Em execução de CI observada após a implementação:

- frontend: 4 testes aprovados;
- backend: 18 testes aprovados;
- falhas: 0.

### Build

Frontend Next.js e backend NestJS/TypeScript compilaram com sucesso.

## E2E real com Clerk

A execução local completa do Playwright, usando contas fictícias da instância Clerk de desenvolvimento, terminou com:

```text
8 passed
0 failed
```

Cenários principais:

- visitante sem sessão vai para o login;
- AGENT ativo chega ao dashboard;
- `/api/v1/me` retorna o perfil interno esperado;
- logout encerra a sessão;
- usuário inativo recebe acesso indisponível;
- `401` após expiração encerra a sessão e volta ao login;
- health checks permanecem públicos.

O plano e os casos estão registrados em:

- `specs/login-flow-test-plan.md`;
- `specs/login-flow-test-cases.md`.

## Segurança e configuração

Verificações realizadas:

- `.env` está coberto pelo `.gitignore`;
- `.env` não está rastreado pelo Git;
- `.env.example` contém apenas placeholders;
- `CLERK_SECRET_KEY` não é enviada ao frontend;
- o papel é obtido do registro interno, e não confiado ao cliente;
- logs de falha não registram token.

## Ajustes encontrados durante a verificação

Durante a validação foram corrigidos problemas reais de integração:

1. uma chave PEM multilinha em `CLERK_JWT_KEY` estava sendo carregada de forma incompleta no `.env`;
2. seletores E2E precisaram ser ajustados depois de identificar problema de codificação de texto;
3. o fluxo de `401` foi ajustado para encerrar a sessão antes de retornar ao login;
4. o CI padrão foi separado do E2E autenticado real, pois as contas Clerk de desenvolvimento não devem ser publicadas no repositório.

## Resultado

A Change 02 atende ao escopo funcional proposto e possui evidência automatizada de autenticação, autorização e comportamento de erro. A implementação foi então sincronizada/arquivada no OpenSpec, gerando a especificação persistente em `openspec/specs/auth-clerk/spec.md`.
