# Tasks — Change 04 Ticket Lifecycle

## Persistência

- [x] criar tabela `tickets`;
- [x] criar sequence e trigger de protocolo;
- [x] criar auditoria de mudanças críticas;
- [x] criar índices de status, prioridade e cliente;
- [x] aplicar migration no Supabase.

## Backend

- [x] criar modelo e enums do chamado;
- [x] implementar repositório Supabase;
- [x] criar e listar chamados;
- [x] consultar detalhe;
- [x] alterar status;
- [x] alterar prioridade;
- [x] resolver chamado;
- [x] restringir reabertura ao supervisor;
- [x] testes unitários;
- [x] testes HTTP/integrados.

## Frontend

- [x] listar chamados;
- [x] filtrar por status e prioridade;
- [x] criar chamado;
- [x] abrir detalhes;
- [x] alterar prioridade e status;
- [x] resolver chamado;
- [ ] validar fluxo completo no ambiente publicado.

## Qualidade

- [x] lint;
- [x] testes automatizados;
- [x] build;
- [x] smoke tests;
- [ ] aceite publicado com banco real.
