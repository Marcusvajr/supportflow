# Change 04 — Ticket Lifecycle

## Why

O chamado técnico é o fluxo central do SupportFlow. Depois de identidade e clientes, o sistema precisa registrar um atendimento com protocolo, prioridade, status e resolução de forma consistente e auditável.

## What Changes

- persistência `Ticket` em PostgreSQL/Supabase;
- acesso à persistência isolado no backend por repositório;
- geração transacional de protocolo `SF-YYYY-NNNNNN` por sequence/trigger PostgreSQL;
- criação de chamado;
- listagem e detalhe;
- alteração de prioridade;
- transições de status conforme `docs/spec.md`;
- resolução com texto obrigatório e `resolvedAt`;
- auditoria das alterações críticas;
- telas de lista, criação e detalhe do chamado.

## Impact

A mudança introduz as principais regras de negócio do domínio de chamados e cria a base necessária para atividades, escalonamento, dashboard e fluxos ponta a ponta.

## Dependências

- `change-02-auth-clerk`;
- `change-03-customer-management`.

## Riscos

- **Transições de status inválidas — Médio.** Mitigação: regra centralizada no serviço.
- **Protocolo duplicado — Médio.** Mitigação: sequence PostgreSQL e restrição única.
- **Mudança sem rastreabilidade — Médio.** Mitigação: trigger de auditoria para alterações críticas.

## Lint

Obrigatório.

## Testes unitários

- criação;
- transições válidas e inválidas;
- resolução obrigatória;
- reabertura exclusiva do supervisor;
- prioridade válida.

## Testes de integração

- `POST /tickets`;
- `PATCH /tickets/:id/status`;
- `PATCH /tickets/:id/priority`;
- `POST /tickets/:id/resolve`;
- fluxo HTTP até resolução.

## Testes E2E/aceite

- criação de chamado com cliente existente;
- avanço do chamado até resolução;
- bloqueio de resolução sem texto;
- bloqueio de transição inválida.

## Critérios de aceite

- backend é fonte única das regras;
- chamado não é excluído fisicamente;
- resolução registra status, data e histórico;
- frontend usa somente a API REST do SupportFlow.
