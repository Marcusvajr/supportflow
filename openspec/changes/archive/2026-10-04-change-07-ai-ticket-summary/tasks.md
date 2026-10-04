# Tasks — Change 07 AI Ticket Summary

## Backend

- [x] abstração de provider;
- [x] provider compatível com Chat Completions;
- [x] composição minimizada do contexto;
- [x] endpoint autenticado;
- [x] timeout e falha controlada;
- [x] teste de que o resumo não altera o chamado.

## Frontend

- [x] ação "Gerar resumo";
- [x] estado de carregamento;
- [x] aviso de revisão humana;
- [x] falha da IA não bloqueia o atendimento.

## Configuração

- [x] URL/modelo externalizados;
- [x] chave mantida fora do código;
- [x] manter a credencial real como configuração externa opcional; a implementação e a falha segura foram verificadas sem versionar segredo.

## Qualidade

- [x] lint;
- [x] testes automatizados com provider fake;
- [x] build sem depender de credencial externa.
