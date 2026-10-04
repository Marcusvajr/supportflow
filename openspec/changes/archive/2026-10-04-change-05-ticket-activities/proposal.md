# Change 05 — Ticket Activities

## Why

O valor principal do SupportFlow está em preservar o contexto técnico entre atendimentos. Para isso, o chamado precisa registrar testes, diagnósticos, observações e eventos em uma linha do tempo consistente.

## What Changes

### Incremento implementado na V3

- persistência `TicketActivity` e `AuditEvent`;
- registrar notas, testes e diagnósticos;
- auditar criação, status, prioridade e resolução;
- montar linha do tempo cronológica;
- permitir reabertura por supervisor conforme regra de negócio;
- interface para registrar atividades e consultar o histórico.

### Continuação planejada

- reatribuição explícita para outro usuário;
- fluxo visual de escalonamento por supervisor;
- continuidade do atendimento por outro responsável;
- destaque dedicado para o diagnóstico mais recente.

## Impact

O incremento da V3 transforma o chamado em um histórico técnico rastreável e fecha a base do primeiro fluxo ponta a ponta. A continuação desta change será usada para concluir o segundo fluxo obrigatório de escalonamento e continuidade.

## Dependências

- `change-04-ticket-lifecycle`.

## Riscos

- **Histórico inconsistente com o ticket — Médio.** Mitigação: triggers e registros de auditoria.
- **Reatribuição sem autorização — Médio.** Mitigação: RBAC no backend antes da conclusão do segundo fluxo.

## Lint

Obrigatório.

## Testes unitários

- tipos de atividade;
- registro de teste e diagnóstico;
- reabertura;
- composição da linha do tempo.

## Testes de integração

- `POST /tickets/:id/activities`;
- `GET /tickets/:id/timeline`;
- fluxo técnico até resolução.

## Testes E2E/aceite

- registrar teste e diagnóstico em chamado;
- consultar histórico completo;
- continuação futura: escalonar, reatribuir e continuar atendimento.

## Critérios de aceite

- registros anteriores nunca são apagados pela inclusão de nova atividade;
- alterações críticas registram autor e data/hora;
- o primeiro fluxo completo mantém contexto até a resolução;
- o segundo fluxo só será marcado como concluído após reatribuição e aceite com supervisor.
