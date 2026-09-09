# Change 05 — Ticket Activities

## Objetivo

Implementar o histórico técnico estruturado do chamado, garantindo continuidade entre atendentes e supervisores.

## Escopo funcional

- persistência `TicketActivity` e `AuditEvent`;
- registrar notas, testes e diagnósticos;
- alterar responsável com evento de histórico;
- escalonar e continuar atendimento;
- destacar diagnóstico mais recente;
- montar linha do tempo cronológica;
- permitir reabertura por supervisor conforme regra de negócio.

## Dependências

- `change-04-ticket-lifecycle`.

## Riscos

- **Histórico inconsistente com o ticket — Médio.** Mitigação: transações para alterações críticas.
- **Reatribuição sem autorização — Médio.** Mitigação: RBAC no backend.

## Lint

Obrigatório.

## Testes unitários

- tipos de atividade;
- reatribuição e reabertura;
- seleção do diagnóstico mais recente.

## Testes de integração

- `POST /tickets/:id/activities`;
- `GET /tickets/:id/activities`;
- alteração de responsável;
- registro atômico de eventos.

## Testes E2E/aceite

- registrar teste e diagnóstico em chamado;
- escalonar, reatribuir e continuar atendimento;
- resolver e reabrir como supervisor.

## Critérios de aceite

- eventos obrigatórios aparecem na linha do tempo;
- alterações críticas registram autor e data/hora;
- fluxo de escalonamento mantém contexto sem apagar registros anteriores.
