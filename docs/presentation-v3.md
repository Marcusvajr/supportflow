# Apresentação V3 — SupportFlow

## Demonstração de 14/10/2026, às 19h

Endereço principal: https://supportflow-pi.vercel.app/dashboard.

Abra a aplicação antes do horário para inicializar a API no plano gratuito. A conta de demonstração tem papel de atendente; reatribuição e reabertura exigem supervisor.

Roteiro sugerido (8 a 10 minutos):

1. Apresente o problema: perda de contexto na passagem de um atendimento técnico.
2. Mostre o dashboard e a separação entre clientes, chamados e indicadores.
3. Abra `SF-2026-000002`: exiba descrição, teste, diagnóstico, resolução e linha do tempo. Esse caso já está persistido e foi reaberto para consulta em 14/10.
4. Abra `SF-2026-000003`: explique o estado encaminhado e a continuidade por outro responsável. Explique a permissão de supervisor sem tentar executá-la com a conta de atendente.
5. Mostre o formulário de novo chamado e explique a validação. Se fizer a demonstração de escrita, utilize somente dados fictícios.
6. Explique a arquitetura: Next.js → API NestJS → Supabase, identidade Clerk e autorização no backend. A persistência usa a Data API do Supabase; Prisma não está implementado.
7. Mostre o repositório e o resultado atual do GitHub Actions. A suíte contém 57 testes (45 API e 12 frontend); os smoke tests do Playwright são uma etapa separada.
8. Encerre com os limites: IA ao vivo e fluxo completo de supervisor dependem de configuração/validação; Sentry não foi comprovado. O núcleo do atendimento funciona sem IA.

O frontend alternativo do Render ainda exibiu autenticação indisponível na verificação de 14/10. Use a Vercel na apresentação. Não inclua senhas ou chaves nos slides nem nos arquivos versionados.

## Catálogo das funcionalidades e roteiro de explicação

Para apresentar **todos os recursos**, veja [Funcionalidades do SupportFlow](funcionalidades.md). A demonstração deve explicar, na ordem: autenticação e permissões; dashboard; cadastro e consulta de clientes; abertura, busca e filtros de chamados; categorias, prioridades e estados; atribuição e reatribuição; registros de observações, testes e diagnósticos; resolução; linha do tempo/auditoria; resumo opcional por IA.

**Limite da IA:** existe botão no frontend e endpoint `POST /api/v1/tickets/:id/ai-summary`, mas chamadas observadas em 14/10/2026 tiveram HTTP 503 (três registros). A geração real depende de um provedor externo com credencial configurada no backend. Não trate essa integração como validada, nem confunda resumo de informações com diagnóstico automático.

**Plataformas:** Vercel hospeda o frontend principal; Render executa API e frontend alternativo; Supabase armazena dados em PostgreSQL; Clerk cuida da identidade; GitHub versiona código e executa o CI; Stitch orientou o protótipo visual.

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
