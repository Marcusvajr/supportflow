# Change 06 — Dashboard and Search

## Objetivo

Disponibilizar visão operacional dos chamados e recursos de busca, filtros e paginação para atendentes e supervisores.

## Escopo funcional

- `GET /api/v1/dashboard/summary`;
- totais por status e prioridade;
- chamados recentes;
- busca por protocolo, cliente e título;
- filtros por status, prioridade, categoria e responsável;
- paginação e ordenação;
- dashboard e lista de chamados no frontend.

## Dependências

- `change-05-ticket-activities`.

## Riscos

- **Consultas lentas — Médio.** Mitigação: paginação, índices e queries agregadas simples.
- **Contagens inconsistentes com filtros — Baixo.** Mitigação: contrato explícito e testes de integração.

## Lint

Obrigatório.

## Testes unitários

- normalização de filtros;
- limites de paginação;
- regras de ordenação.

## Testes de integração

- dashboard summary;
- filtros combinados;
- paginação e ordenação;
- busca textual.

## Testes E2E/aceite

- usuário localiza chamado por protocolo;
- aplica filtros combinados;
- dashboard reflete chamados em diferentes estados.

## Critérios de aceite

- page padrão 1;
- pageSize padrão 20 e máximo 100;
- filtros podem ser combinados sem quebrar paginação;
- supervisor consegue identificar chamados críticos e escalonados.
