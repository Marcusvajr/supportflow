# Apresentação V3 — SupportFlow

## 1. Problema e objetivo

O SupportFlow reduz perda de contexto e retrabalho em chamados técnicos de provedores de internet. Quando um atendimento muda de responsável, testes, hipóteses e diagnósticos podem ficar dispersos. A aplicação concentra cliente, chamado, prioridade, responsável, atividades técnicas, diagnóstico, resolução e histórico.

## 2. Produtos entregues

### Discovery e produto
- Lean Canvas;
- personas;
- jornada do usuário;
- story map;
- definição do problema;
- PRD;
- especificações OpenSpec.

### Arquitetura
- contexto;
- contêineres;
- componentes;
- classes;
- implantação;
- API REST versionada.

### Aplicação
- autenticação Clerk;
- autorização AGENT/SUPERVISOR;
- clientes fictícios;
- abertura e acompanhamento de chamados;
- protocolo, status e prioridade;
- atividades técnicas e diagnóstico;
- resolução e linha do tempo;
- escalonamento e reatribuição;
- dashboard, busca, filtros, paginação e ordenação;
- resumo assistivo por IA com falha controlada.

### Plataforma
- Next.js/Vercel;
- NestJS/Render;
- PostgreSQL/Supabase;
- CI/CD;
- Docker/OCI;
- IaC;
- observabilidade e rastreabilidade.

## 3. Fluxo A — Atendimento completo

Login → cliente → abertura de chamado → diagnóstico → teste → resolução → histórico.

## 4. Fluxo B — Escalonamento e continuidade

Login → chamado → escalonamento → reatribuição por supervisor → continuidade → resolução/reabertura → histórico.

## 5. Segurança

- identidade externa via Clerk;
- autorização interna;
- segredos somente em variáveis de ambiente;
- HTTPS;
- RLS no Supabase;
- proteção adicional entre Render e Data API;
- logs sem dados sensíveis;
- somente dados fictícios.

## 6. Testabilidade

- testes unitários;
- testes HTTP/integrados;
- autorização/RBAC;
- observabilidade;
- IA com provider fake;
- Playwright smoke;
- build de containers;
- audit de dependências.

## 7. IA assistiva

A IA recebe apenas fatos registrados e produz resumo de apoio. Ela não altera status, prioridade, responsável, diagnóstico ou resolução. Se o provedor estiver indisponível, o atendimento continua funcionando.

## 8. Principais achados

1. Autenticação externa não substitui autorização de domínio.
2. Persistência transformou o protótipo em fluxo demonstrável.
3. Deploy revelou problemas que não apareciam localmente.
4. Observabilidade precisa nascer junto com a API.
5. IA deve degradar com segurança.
6. Automação de testes reduz regressões.

## 9. Estado da V3

O núcleo funcional, os dois fluxos de negócio, persistência, segurança, dashboard/busca, containers, IaC e observabilidade estão implementados. A geração de IA ao vivo e o fluxo publicado completo com supervisor permanecem pendentes de configuração e validação externa. No teste manual de 05/10, o fluxo de atendente chegou à resolução e o segundo chamado chegou ao escalonamento, com persistência e auditoria confirmadas. Observabilidade implementada significa logs estruturados e correlação; não comprova integração com Sentry.
