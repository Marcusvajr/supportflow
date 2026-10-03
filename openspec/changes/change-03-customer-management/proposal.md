# Change 03 — Customer Management

## Why

Os fluxos de chamados precisam de clientes de referência para que o atendimento tenha contexto e possa ser demonstrado de ponta a ponta. Esta mudança introduz somente dados fictícios, preservando o caráter acadêmico do projeto.

## What Changes

- persistência `Customer` em PostgreSQL/Supabase;
- acesso ao banco exclusivamente pelo backend NestJS usando a API REST/PostgREST do Supabase;
- `GET /api/v1/customers` com paginação e busca;
- `GET /api/v1/customers/:id`;
- `POST /api/v1/customers`;
- `PATCH /api/v1/customers/:id`;
- telas de lista, detalhe e formulário de cliente;
- validações de nome, código de referência e campos mascarados;
- migration e seed com dados exclusivamente fictícios.

## Impact

A mudança introduz persistência relacional real no SupportFlow. As próximas changes de chamados passam a depender de clientes válidos criados por esta camada.

A comunicação com o Supabase permanece isolada no backend. O frontend não recebe chaves de serviço e continua consumindo apenas a API versionada do SupportFlow.

## Dependências

- `change-01-project-foundation`;
- `change-02-auth-clerk`.

## Riscos

- **Uso acidental de dados reais — Médio.** Mitigação: somente dados fictícios e indicação explícita na UI/seed.
- **Código de referência duplicado — Baixo.** Mitigação: restrição única no PostgreSQL e resposta `409`.
- **Indisponibilidade/configuração incorreta do banco — Médio.** Mitigação: falha controlada `503`, health separado e segredos em variáveis de ambiente.

## Lint

Obrigatório.

## Testes unitários

- validações do serviço de clientes;
- criação e atualização;
- conflito de `referenceCode`.

## Testes de integração

- criação, consulta, listagem e atualização pela API;
- paginação e busca;
- proteção de endpoints;
- `400`, `404` e `409`.

## Testes E2E/aceite

- usuário autenticado cria cliente fictício e o encontra na listagem;
- usuário abre o detalhe e altera os dados;
- formulário rejeita campos obrigatórios inválidos.

## Critérios de aceite

- frontend não acessa o banco diretamente;
- dados persistidos via API NestJS;
- PostgreSQL/Supabase é a fonte de persistência;
- segredos do Supabase permanecem somente no backend;
- nenhuma informação real de assinantes no projeto acadêmico.
