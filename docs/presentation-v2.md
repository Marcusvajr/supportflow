# Apresentação da Entrega Incremental v2 — SupportFlow

Este arquivo serve como apoio para explicar a entrega sem depender de slides. A ideia é mostrar o que já existe de verdade no repositório, o que foi testado e o que ainda está no roadmap.

## 1. O que é o SupportFlow

O SupportFlow é uma aplicação web voltada para atendimento técnico em provedores de internet. O problema que motivou o projeto é simples: durante um atendimento, testes, diagnósticos e observações podem ficar espalhados em vários lugares. Quando o chamado muda de responsável, parte do contexto pode se perder e procedimentos acabam sendo repetidos.

A proposta é concentrar essas informações em um histórico técnico único, permitindo que outro atendente consiga entender o que já aconteceu e continuar o atendimento.

## 2. O que foi entregue nesta etapa

Nesta entrega foram trabalhadas as seções 1 a 6 do roteiro de Delivery. O projeto ficou organizado para evoluir por mudanças pequenas, usando OpenSpec para registrar proposta, design, tarefas, especificações e status.

Os principais documentos são:

- `docs/problem.md` — problema e contexto;
- `docs/prd.md` — requisitos do produto;
- `docs/spec.md` — regras, fluxos e contratos técnicos;
- `docs/architecture.md` — decisões de arquitetura;
- `docs/design.md` — referência visual e de UX;
- `docs/delivery-configuration.md` — execução das seções 1 a 6 do Delivery;
- `docs/auth-clerk.md` — detalhes da autenticação;
- `docs/compliance-v2.md` — requisitos acadêmicos incorporados ao roadmap;
- `openspec/roadmap.md` — sequência das mudanças;
- `openspec/specs/auth-clerk/spec.md` — especificação consolidada da autenticação.

## 3. Como o desenvolvimento foi dividido

O roadmap tem oito changes. Nesta etapa, duas já possuem implementação concreta:

1. `change-01-project-foundation` — fundação técnica do projeto;
2. `change-02-auth-clerk` — autenticação e autorização.

As seguintes continuam planejadas:

3. `change-03-customer-management` — clientes fictícios;
4. `change-04-ticket-lifecycle` — ciclo principal do chamado;
5. `change-05-ticket-activities` — testes, diagnósticos e linha do tempo;
6. `change-06-dashboard-and-search` — dashboard, busca e filtros;
7. `change-07-ai-ticket-summary` — resumo assistivo por IA;
8. `change-08-platform-compliance` — observabilidade, containers e IaC.

Essa separação foi útil porque permitiu resolver primeiro a estrutura e a autenticação antes de começar as regras de clientes e chamados.

## 4. Change 01 — fundação

A primeira change criou a base executável do projeto:

- monorepo com npm workspaces;
- frontend em Next.js, React e TypeScript;
- backend em NestJS e TypeScript;
- health check da API;
- scripts de lint, testes, build e E2E;
- GitHub Actions;
- estrutura de documentação e configuração.

Com essa base funcionando, as próximas mudanças puderam ser feitas sem misturar configuração inicial com regra de negócio.

## 5. Change 02 — autenticação com Clerk

A segunda change implementou o primeiro fluxo funcional completo do SupportFlow.

O Clerk ficou responsável por autenticar a identidade. Depois do login, o frontend obtém o token da sessão e o envia para o backend. O NestJS valida esse token e usa o identificador do Clerk para localizar o usuário interno. O papel do usuário e a situação ativo/inativo vêm do próprio SupportFlow, e não de informações enviadas pelo navegador.

O fluxo ficou assim:

```text
Usuário acessa uma área privada
        ↓
Sem sessão → /sign-in
        ↓
Clerk autentica o usuário
        ↓
Frontend obtém o token da sessão
        ↓
GET /api/v1/me com Bearer token
        ↓
NestJS valida o token
        ↓
Busca usuário interno pelo externalAuthId
        ↓
Usuário ativo → dashboard
Usuário inativo → /access-unavailable
Sessão inválida/expirada → volta ao login
```

Também foram implementados logout, tratamento de `401` e `403`, RBAC para `AGENT` e `SUPERVISOR` e logs de falha sem registrar tokens.

## 6. O que deu mais trabalho

### Configuração do Clerk e variáveis de ambiente

A parte mais trabalhosa não foi somente escrever o código. O frontend, o backend e os testes precisavam usar as mesmas configurações sem colocar segredos no Git.

Durante os testes apareceu um problema com `CLERK_JWT_KEY`: uma chave PEM multilinha estava sendo lida de forma incompleta pelo `.env`. Em vez de manter uma configuração quebrada, o fluxo final passou a usar a verificação suportada pelo Clerk sem depender dessa PEM local malformada.

O `.env` ficou somente no computador e o repositório mantém apenas `.env.example` sem valores reais.

### Usuário autenticado não é o mesmo que usuário autorizado

Outro ponto importante foi separar autenticação de autorização. O fato de uma pessoa conseguir entrar pelo Clerk não significa que ela automaticamente pode usar o SupportFlow.

Por isso, o backend procura o `externalAuthId` em um repositório interno e verifica `active` e `role`. Um usuário inexistente ou inativo recebe `403`. Isso também evita confiar em papel enviado pelo cliente.

### Testes E2E mostraram problemas que não apareciam nos testes isolados

Nos testes de ponta a ponta apareceram situações que os testes unitários não mostravam, principalmente:

- redirecionamento para o login;
- associação do usuário Clerk com o usuário interno;
- comportamento do usuário inativo;
- sessão expirada;
- logout;
- carregamento das variáveis de ambiente;
- problema de codificação de texto nos próprios testes.

Depois dos ajustes, a execução local completa terminou com:

```text
8 passed
0 failed
```

### CI e testes que dependem de credenciais

O fluxo autenticado real depende de contas de desenvolvimento do Clerk. Essas credenciais não devem ficar no repositório. Por isso, o GitHub Actions padrão executa os smoke tests que não precisam de segredos externos, enquanto o E2E completo de autenticação é executado em ambiente local configurado.

Assim o pipeline continua verificando lint, testes, build e integração básica sem exigir que credenciais de teste sejam publicadas.

## 7. Principais decisões que ficaram mais claras

- regras de negócio e autorização ficam no backend;
- o frontend não acessa o banco diretamente;
- identidade externa e usuário interno são conceitos separados;
- segredos não entram no Git;
- cada change deve ter escopo pequeno o suficiente para ser testada antes da próxima;
- documentação, código e testes precisam contar a mesma história;
- IA, quando entrar no projeto, será assistiva e não tomará decisões operacionais pelo atendente.

## 8. Evidências desta entrega

| Evidência | Onde conferir |
|---|---|
| Seções 1 a 6 do Delivery | `docs/delivery-configuration.md` |
| Roadmap incremental | `openspec/roadmap.md` |
| Change 01 | `openspec/changes/change-01-project-foundation/` |
| Change 02 arquivada | `openspec/changes/archive/2026-09-14-change-02-auth-clerk/` |
| Spec consolidada da autenticação | `openspec/specs/auth-clerk/spec.md` |
| Implementação frontend | `apps/web/` |
| Implementação backend | `apps/api/` |
| Testes de autenticação | `apps/web/tests/` e `apps/api/tests/` |
| CI | `.github/workflows/ci.yml` |

## 9. O que ainda não está implementado

É importante não misturar planejamento com entrega pronta. Nesta versão ainda não estão implementados o CRUD de clientes, persistência real com Prisma/Supabase, ciclo completo dos chamados, dashboard operacional, resumo por IA, Sentry, containers da aplicação e IaC.

Esses itens estão descritos nas próximas changes do roadmap e serão implementados nos incrementos seguintes.

## 10. Resumo para falar em aula

> O SupportFlow foi pensado para evitar perda de contexto em atendimentos técnicos. Nesta entrega eu preparei o ambiente, organizei o roadmap com OpenSpec e implementei os dois primeiros incrementos. A Change 01 criou a fundação com Next.js, NestJS, testes e CI. A Change 02 implementou a autenticação com Clerk e a autorização no backend. O Clerk identifica o usuário, mas quem decide se ele está ativo e qual papel possui é o SupportFlow. Durante os testes eu tive que corrigir problemas reais de configuração, principalmente variáveis de ambiente, uma chave PEM que não estava sendo lida corretamente, usuários ativos e inativos e cenários de sessão expirada. No final, o fluxo completo de autenticação ficou com 8 testes E2E aprovados. As próximas mudanças continuam planejadas no roadmap, mas eu deixei claro no repositório o que já está implementado e o que ainda é evolução futura.
