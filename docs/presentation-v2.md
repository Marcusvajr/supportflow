# Apresentação da Entrega Incremental v2 — SupportFlow

Este documento reúne, em formato textual, os pontos principais da apresentação da entrega incremental do **SupportFlow**.

## 1. Resumo do projeto

O SupportFlow é uma aplicação web criada para centralizar e dar continuidade ao atendimento técnico em provedores de internet.

O problema abordado é a fragmentação das informações durante o suporte: quando testes, diagnósticos, histórico e contexto ficam espalhados, o atendimento pode gerar retrabalho, repetição de procedimentos e perda de informação em transferências ou escalonamentos.

A proposta do SupportFlow é manter o contexto técnico organizado ao longo do ciclo de atendimento.

## 2. Documentos incrementais entregues

A documentação do projeto está distribuída entre `docs/` e `openspec/`.

Principais documentos:

- `docs/problem.md` — definição do problema;
- `docs/prd.md` — requisitos do produto;
- `docs/spec.md` — especificação técnica;
- `docs/architecture.md` — arquitetura e decisões técnicas;
- `docs/design.md` — design e diretrizes de interface;
- `docs/delivery-configuration.md` — execução das seções 1 a 6 do roteiro de Delivery;
- `docs/auth-clerk.md` — documentação da autenticação;
- `openspec/roadmap.md` — planejamento incremental das mudanças;
- `openspec/specs/auth-clerk/spec.md` — especificação consolidada da autenticação.

## 3. Roadmap incremental

O projeto foi dividido em mudanças pequenas ou médias para reduzir risco e facilitar verificação.

Principais changes:

1. `change-01-project-foundation` — fundação técnica;
2. `change-02-auth-clerk` — autenticação e autorização;
3. `change-03-customer-management` — clientes;
4. `change-04-ticket-lifecycle` — ciclo de vida do chamado;
5. `change-05-ticket-activities` — atividades e histórico;
6. `change-06-dashboard-and-search` — dashboard, busca e filtros;
7. `change-07-ai-ticket-summary` — resumo assistivo por IA;
8. `change-08-platform-compliance` — observabilidade, containers e conformidade.

Nesta entrega, a fundação e a autenticação já possuem implementação concreta no repositório.

## 4. Incremento 1 — Fundação do projeto

A Change 01 estabeleceu a estrutura inicial do SupportFlow:

- monorepo com npm workspaces;
- frontend com Next.js, React e TypeScript;
- backend com NestJS e TypeScript;
- endpoint de health check;
- estrutura inicial de testes;
- pipeline de CI;
- organização de documentação e configuração.

Essa etapa criou a base necessária para as próximas mudanças.

## 5. Incremento 2 — Autenticação com Clerk

A Change 02 implementou autenticação e autorização.

Foram desenvolvidos:

- login com Clerk;
- logout;
- proteção de rotas privadas;
- sessão autenticada no frontend;
- envio de Bearer token para o backend;
- validação do token no NestJS;
- associação da identidade externa com usuário interno;
- controle de usuário ativo/inativo;
- papéis `AGENT` e `SUPERVISOR`;
- tratamento de `401` e `403`;
- tela de acesso indisponível;
- testes automatizados de autenticação.

### Fluxo simplificado

```text
Usuário acessa rota privada
        ↓
Sem sessão → /sign-in
        ↓
Clerk autentica
        ↓
Frontend recebe sessão/token
        ↓
GET /api/v1/me com Bearer token
        ↓
NestJS valida o token
        ↓
Busca usuário interno pelo ID Clerk
        ↓
Ativo → dashboard
Inativo → acesso indisponível
401 → retorno ao login
```

## 6. Verificação e testes

A verificação incluiu execução local da aplicação e testes automatizados com Playwright.

Foram cobertos cenários como:

- redirecionamento de visitante para login;
- health do frontend e backend;
- login real com Clerk;
- usuário ativo acessando o dashboard;
- usuário inativo recebendo acesso indisponível;
- logout;
- sessão expirada e resposta `401`.

Resultado final dos testes E2E:

```text
8 passed
0 failed
```

A Change 02 foi então arquivada no OpenSpec e sua especificação foi consolidada em `openspec/specs/auth-clerk/spec.md`.

## 7. Principais achados durante o desenvolvimento

### 7.1 Configuração de ambiente precisa ser tratada como parte da implementação

Uma parte relevante do trabalho não estava apenas no código. Clerk, variáveis de ambiente, portas locais, OpenSpec, Playwright, MCPs e ferramentas de agente precisaram funcionar de forma integrada.

Isso mostrou que um incremento só pode ser considerado pronto quando o ambiente também é reproduzível e verificável.

### 7.2 Segredos não devem fazer parte do código

As credenciais foram mantidas no `.env` local, que permanece ignorado pelo Git. O repositório contém apenas `.env.example`.

Durante a implementação também ficou evidente que chaves multilinha, como uma chave pública PEM, exigem cuidado especial em arquivos de ambiente. Para o fluxo final, a autenticação foi configurada sem depender de uma chave PEM multilinha incorretamente carregada.

### 7.3 Testes E2E encontraram problemas que testes isolados não mostravam

O Playwright revelou problemas reais de integração, por exemplo:

- automação da tela de login do Clerk;
- carregamento das variáveis de ambiente pela API;
- associação entre usuário Clerk e usuário interno;
- redirecionamento de usuário inativo;
- sessão expirada;
- seletores sensíveis a texto/encoding.

O resultado de 8 testes aprovados foi obtido somente depois de validar o fluxo completo.

### 7.4 Incrementos pequenos facilitaram diagnóstico e correção

Separar fundação e autenticação em changes diferentes tornou mais fácil localizar problemas e validar o comportamento esperado antes de avançar para clientes e chamados.

### 7.5 A especificação precisa acompanhar o código

O OpenSpec foi usado para manter proposta, design, especificação e tarefas associados à implementação. Após a validação, a Change 02 foi arquivada e a especificação persistente foi atualizada.

## 8. Observações sobre o processo de desenvolvimento

O processo adotado priorizou:

- entendimento do problema antes da implementação;
- planejamento incremental;
- documentação junto do código;
- segurança das credenciais;
- verificação automatizada;
- correção antes de arquivar uma change;
- rastreabilidade no Git e no OpenSpec.

O uso de agentes de IA acelerou pesquisa, geração e revisão, mas as decisões precisaram ser confirmadas por execução real do projeto e dos testes.

## 9. Situação atual

Nesta entrega:

- ambiente de desenvolvimento preparado;
- seções 1 a 6 do roteiro de Delivery documentadas;
- roadmap criado;
- fundação implementada;
- autenticação implementada;
- Change 02 validada e arquivada;
- testes E2E de autenticação aprovados;
- próximas changes permanecem planejadas no roadmap.

## 10. Resumo para apresentação oral

Uma forma curta de apresentar esta entrega é:

> O SupportFlow é uma central de atendimento técnico para evitar perda de contexto e retrabalho. Nesta entrega eu organizei o desenvolvimento de forma incremental com OpenSpec. Primeiro foi criada a fundação do projeto com Next.js, NestJS, testes e CI. Depois foi implementada a autenticação com Clerk, incluindo login, proteção de rotas, validação de token no backend, usuários ativos e inativos e controle de papéis. A integração foi validada com Playwright e o resultado final foi de 8 testes E2E aprovados. Um dos principais aprendizados foi que configuração de ambiente, segurança de credenciais e testes ponta a ponta fazem parte da implementação, e não apenas o código. A Change 02 foi verificada, arquivada no OpenSpec e o roadmap mantém as próximas evoluções planejadas.
