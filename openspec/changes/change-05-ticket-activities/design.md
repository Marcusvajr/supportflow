# Design — Change 05 Ticket Activities

## Contexto

O principal valor do SupportFlow é preservar o contexto técnico. Por isso, cada teste, observação e diagnóstico fica associado ao chamado e é apresentado em ordem cronológica junto dos eventos automáticos de auditoria.

## Persistência

- `ticket_activities`: registros produzidos pelos atendentes;
- `audit_events`: eventos produzidos pelas mudanças críticas do domínio.

As tabelas são separadas porque atividade técnica representa conteúdo operacional, enquanto auditoria representa rastreabilidade de mudanças.

## Linha do tempo

A API combina atividades e auditorias e ordena pelo campo `createdAt`. O frontend identifica visualmente:

- observação;
- teste;
- diagnóstico;
- criação/mudança de status;
- prioridade;
- resolução.

## Decisão humana

O sistema registra o diagnóstico informado pelo profissional, mas não interpreta automaticamente o resultado. A futura IA da Change 07 utilizará esse histórico apenas para produzir resumo assistivo.
