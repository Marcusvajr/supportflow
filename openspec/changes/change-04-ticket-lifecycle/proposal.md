# Change 04 — Ticket Lifecycle

## Objetivo

Implementar o ciclo principal do chamado técnico: criação, protocolo, prioridade, transições de status e resolução.

## Escopo funcional

- persistência `Ticket` via Prisma;
- geração de protocolo `SF-YYYY-NNNNNN` no backend;
- criação de chamado;
- listagem e detalhe básico;
- alteração de prioridade;
- transições de status conforme `docs/spec.md`;
- resolução com texto obrigatório e `resolvedAt`;
- auditoria das alterações críticas.

## Dependências

- `change-02-auth-clerk`;
- `change-03-customer-management`.

## Riscos

- **Transições de status inválidas — Médio.** Mitigação: máquina de estados/regra centralizada no serviço.
- **Protocolo duplicado — Médio.** Mitigação: geração transacional e restrição única.

## Lint

Obrigatório.

## Testes unitários

- geração de protocolo;
- transições válidas e inválidas;
- resolução obrigatória;
- prioridade válida.

## Testes de integração

- `POST /tickets`;
- `PATCH /tickets/:id/status`;
- `PATCH /tickets/:id/priority`;
- `POST /tickets/:id/resolve`;
- persistência e auditoria atômicas.

## Testes E2E/aceite

- criação de chamado com cliente existente;
- avanço do chamado até resolução;
- bloqueio de resolução sem texto;
- bloqueio de transição inválida.

## Critérios de aceite

- backend é fonte única das regras;
- chamado não é excluído fisicamente;
- resolução registra status, data e histórico.
