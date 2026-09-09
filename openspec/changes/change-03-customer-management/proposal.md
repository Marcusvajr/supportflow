# Change 03 — Customer Management

## Objetivo

Implementar cadastro e consulta de clientes fictícios necessários para os fluxos de atendimento.

## Escopo funcional

- persistência `Customer` em PostgreSQL/Supabase via Prisma;
- `GET /api/v1/customers` com paginação e busca;
- `GET /api/v1/customers/:id`;
- `POST /api/v1/customers`;
- `PATCH /api/v1/customers/:id`;
- telas de lista, detalhe e formulário de cliente;
- validações de nome, código de referência e campos mascarados.

## Dependências

- `change-01-project-foundation`;
- `change-02-auth-clerk`.

## Riscos

- **Uso acidental de dados reais — Médio.** Mitigação: somente dados fictícios e indicação explícita na UI/seed.
- **Código de referência duplicado — Baixo.** Mitigação: índice único e resposta 409.

## Lint

Obrigatório.

## Testes unitários

- validações do serviço de clientes;
- criação e atualização;
- conflito de `referenceCode`.

## Testes de integração

- CRUD permitido;
- paginação e busca;
- 404 e 409.

## Testes E2E/aceite

- usuário autenticado cria cliente fictício e o encontra na listagem;
- formulário rejeita campos obrigatórios inválidos.

## Critérios de aceite

- frontend não acessa o banco diretamente;
- dados persistidos via API NestJS;
- nenhuma informação real de assinantes no projeto acadêmico.
