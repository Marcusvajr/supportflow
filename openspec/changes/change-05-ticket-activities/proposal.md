# Change 05 — Ticket Activities

## Why

O valor principal do SupportFlow está em preservar o contexto técnico entre atendimentos. Para isso, o chamado precisa registrar testes, diagnósticos, reatribuições e eventos em uma linha do tempo consistente.

## What Changes

- persistência `TicketActivity` e `AuditEvent`;
- registrar notas, testes e diagnósticos;
- alterar responsável com evento de histórico;
- escalonar e continuar atendimento;
- destacar diagnóstico mais recente;
- montar linha do tempo cronológica;
- permitir reabertura por supervisor conforme regra de negócio.

## Impact

A mudança transforma o chamado em um histórico técnico rastreável e viabiliza os dois fluxos ponta a ponta planejados no roadmap, além de fornecer contexto para busca, dashboard e resumo assistivo por IA.

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
