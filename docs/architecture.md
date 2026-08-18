# Arquitetura de Software

## Contexto Arquitetural

### Objetivo

Este documento define a arquitetura de software do produto **SupportFlow**, estabelecendo diretrizes técnicas, restrições arquiteturais e requisitos não funcionais para implementação por desenvolvedores e agentes de inteligência artificial.

### Escopo

A arquitetura contempla:

- Frontend web.
- Backend REST.
- Banco de dados PostgreSQL.
- Infraestrutura de deployment.
- Segurança e identidade.
- Observabilidade.
- Pipeline CI/CD.
- Testes.
- Integrações externas essenciais do MVP.

### Arquitetura de Referência

- Estilo arquitetural: monólito modular no backend + frontend web desacoplado.
- Comunicação: HTTPS + REST + JSON.
- Infraestrutura: serviços gerenciados.
- Observabilidade: captura de erros e logs estruturados.
- Segurança: autenticação delegada ao Clerk e autorização no backend.

### Stack Tecnológica

#### Frontend

- Linguagem: TypeScript.
- Framework: Next.js.
- Biblioteca de UI: React.
- Roteamento: App Router do Next.js.
- Estilização: Tailwind CSS.
- Validação de formulários: React Hook Form + Zod.
- Consumo da API: Fetch API / cliente HTTP encapsulado.

#### Backend

- Linguagem: TypeScript.
- Runtime: Node.js.
- Framework: NestJS.
- ORM: Prisma.
- Validação: class-validator/class-transformer ou Zod, conforme decisão de implementação.
- Documentação de API: Swagger/OpenAPI.

#### Banco de Dados

- SGBD: PostgreSQL.
- Serviço: Supabase.
- Migrations: Prisma Migrate.

#### Observabilidade

- Plataforma: Sentry.
- Logs: estruturados em JSON no backend.

#### Identidade

- Provedor: Clerk.
- Modelo de autorização: RBAC (`AGENT`, `SUPERVISOR`).

#### Desenvolvimento

- Git + GitHub.
- Google Antigravity como agente priorizado.
- Docker opcional para ambiente local do backend.
- OpenAPI como contrato de API.
- Playwright para E2E.

#### DevOps

- CI/CD: GitHub Actions.
- Frontend: Vercel.
- Backend: deployment compatível com Node.js; para o MVP poderá ser hospedado separadamente em serviço apropriado. A URL será configurada por variável de ambiente.
- Banco: Supabase.
- Infraestrutura como código: fora do MVP.

### Estrutura do Repositório

```text
supportflow/
├── apps/
│   ├── web/
│   └── api/
├── docs/
│   ├── problem.md
│   ├── prd.md
│   ├── spec.md
│   ├── architecture.md
│   └── design.md
├── .github/
│   └── workflows/
├── .env.example
├── README.md
└── package.json
```

---

## Adequação Funcional

### Fonte Única de Verdade

- Regras de negócio pertencem ao backend NestJS.
- PostgreSQL é a fonte persistente de verdade.
- O frontend não deve decidir transições de estado ou permissões.
- O frontend pode refletir regras para UX, mas o backend sempre revalida.

### Política de Comunicação entre Camadas

Todas as operações de negócio devem ocorrer através da API REST do backend.

É proibido:

- frontend acessar tabelas de negócio diretamente;
- frontend utilizar credencial administrativa do Supabase;
- regras de autorização existirem somente na interface;
- manipular banco de produção manualmente para fluxos normais.

### APIs e Versionamento

Base URL:

```text
/api/v1
```

Estratégia:

```text
Versionamento por prefixo de URL.
```

### Endpoints Públicos

- health check;
- endpoints estritamente necessários ao fluxo de autenticação, caso aplicável.

### Endpoints Protegidos

- clientes;
- chamados;
- atividades;
- dashboard;
- usuário atual.

### Contrato de API

- APIs versionadas.
- Documentação OpenAPI.
- JSON.
- Paginação em coleções.
- Filtros e ordenação quando aplicáveis.
- Backend como fonte única das regras.
- DTOs explícitos de entrada e saída.

### Estratégia de Tenancy

#### MVP

- Instância única de demonstração.
- Sem multi-tenancy.

#### Evolução Futura

- `organizationId` em entidades de negócio para isolamento por provedor.

---

## Eficiência de Desempenho

### Comunicação entre Componentes

- HTTPS.
- JSON.
- Compressão provida pela infraestrutura quando disponível.

### Rate Limiting

- Rotas autenticadas: limite inicial sugerido de 120 requisições/minuto por usuário.
- Login é responsabilidade principal do Clerk.

### Transações e Persistência

Transações devem ser usadas quando uma operação alterar ticket e histórico de forma atômica.

Exemplo:

- atualizar status;
- criar evento de status;
- confirmar ambos na mesma transação.

### Estratégias Futuras de Escalabilidade

- índices adicionais no PostgreSQL;
- cache de consultas de dashboard;
- filas para integrações;
- armazenamento externo para anexos.

---

## Compatibilidade

### Integração

- REST sobre HTTPS.
- Integração de identidade via tokens do Clerk.

### Formatos de Comunicação

- JSON para API.
- ISO 8601 para datas.
- UUID ou identificadores equivalentes para entidades.

### Versionamento

- `/api/v1`.
- Breaking changes exigem nova versão.

### CORS

- produção: apenas origem oficial do frontend;
- desenvolvimento: origem local configurada por ambiente.

### Portabilidade

- nenhuma chave fixa no código;
- configuração externa por ambiente;
- PostgreSQL padrão para facilitar migração de provedor.

---

## Usabilidade

### Diretrizes Frontend

- desktop-first sem bloquear uso responsivo;
- navegação lateral consistente;
- feedback claro de carregamento, sucesso e erro;
- formulários com validação imediata;
- status e prioridade representados por texto e indicador visual, nunca apenas cor.

### Experiência de Autenticação

- login simplificado pelo Clerk;
- redirecionamento para dashboard após autenticação;
- sessão expirada redireciona ao login;
- usuário autenticado mas sem registro ativo recebe tela de acesso indisponível.

### Consistência de Interfaces

Permitido no frontend:

- validação de formato;
- controle de estado de UI;
- chamadas à API;
- renderização condicional baseada em permissões recebidas.

Não permitido:

- persistência direta de regras de negócio;
- segredo de backend;
- service role do Supabase;
- autorização baseada apenas em ocultar botões.

---

## Confiabilidade

### Tratamento de Erros

Padrão baseado em Problem Details:

```json
{
  "type": "validation_error",
  "title": "Dados inválidos",
  "status": 400,
  "detail": "Descrição do problema",
  "instance": "/api/v1/recurso"
}
```

### Auditoria

Operações auditadas:

- CREATE de ticket;
- mudanças de status;
- mudanças de prioridade;
- mudanças de responsável;
- resolução;
- reabertura.

Campos mínimos:

- usuário;
- entidade;
- ação;
- data/hora;
- metadados essenciais.

### Migrations

- migrations versionadas no Git;
- execução automatizada/controlada no deploy.

É proibido:

- editar estrutura de produção manualmente sem migration;
- remover migration já aplicada.

### Testes Automatizados

- Lint: ESLint.
- Unidade: Jest/Vitest conforme aplicação.
- Integração: Jest + banco de teste ou estratégia isolada.
- E2E: Playwright.

### Cobertura Mínima

Meta acadêmica inicial:

- backend: 70% de linhas nas camadas de negócio;
- frontend: testes focados nos fluxos críticos, sem meta artificial para componentes puramente visuais.

### Critérios de Teste

Toda regra de negócio relevante deve considerar:

- Happy Path.
- Sad Path.
- Edge Cases.

---

## Segurança

### Princípios Gerais

- menor privilégio;
- autenticação em todas as rotas privadas;
- validação server-side;
- segredos fora do repositório;
- minimização de dados;
- uso exclusivo de dados fictícios na demonstração acadêmica.

### Gestão de Identidade

Responsabilidades do Clerk:

- login;
- logout;
- recuperação de acesso;
- sessão;
- recursos de MFA quando ativados.

### Autenticação

Frontend:

- inicia fluxo de login;
- mantém experiência de sessão;
- envia token válido à API.

Backend:

- valida token;
- resolve identidade para usuário interno;
- rejeita chamadas inválidas.

Identity Provider:

- autentica o usuário;
- emite tokens;
- gerencia sessão.

Fluxo:

```text
Usuário
  ↓
Next.js
  ↓
Clerk
  ↓ token
Next.js
  ↓ Authorization: Bearer
NestJS
  ↓ valida token
Serviço de negócio
  ↓
PostgreSQL/Supabase
```

### Autorização

- RBAC.
- Papéis: `AGENT` e `SUPERVISOR`.
- Backend aplica guards/policies.

### Papéis e Permissões

#### AGENT

Pode:

- consultar dados permitidos;
- criar chamados;
- registrar atividades;
- alterar chamados sob regras do negócio;
- resolver chamados.

#### SUPERVISOR

Pode:

- tudo do agente;
- reatribuir chamados;
- reabrir chamados resolvidos;
- acessar visões consolidadas.

### Restrições do Frontend

É proibido:

- service key do Supabase;
- segredo do Clerk;
- acesso administrativo direto ao banco.

### Proteção Contra Ameaças

#### Transporte

- HTTPS obrigatório em produção.

#### Headers

- Content-Security-Policy quando compatível.
- X-Content-Type-Options.
- Referrer-Policy.
- Demais headers providos pela infraestrutura/framework.

#### Injeção

- ORM com queries parametrizadas;
- validação de entrada;
- nenhuma concatenação manual de SQL.

#### Controle de Acesso

- recurso sempre validado no backend;
- IDs fornecidos pelo cliente não conferem autorização por si só.

### Segurança de Dados

- dados fictícios no ambiente acadêmico;
- não armazenar senhas da aplicação;
- logs não devem conter tokens;
- dados pessoais minimizados.

### Segurança de APIs

- token obrigatório.
- autorização por papel.
- validação de payload.
- rate limiting.
- tratamento consistente de erro.

---

## Manutenibilidade

### Organização de Código

Backend por módulos de domínio:

```text
src/
├── auth/
├── users/
├── customers/
├── tickets/
├── dashboard/
├── common/
└── observability/
```

Frontend por funcionalidades e componentes reutilizáveis.

### Convenções de Desenvolvimento

- TypeScript em modo estrito.
- ESLint/formatter.
- nomes em inglês no código.
- documentação em português.
- commits pequenos e descritivos.
- nenhuma regra de negócio duplicada no frontend.

### Variáveis de Ambiente

Exemplos:

```text
DATABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=
SENTRY_DSN=
```

É proibido:

- versionar `.env`;
- inserir credenciais diretamente no código.

### Diretrizes para Agentes de IA

Antes de alterar código:

- ler `docs/spec.md`;
- ler `docs/architecture.md`;
- avaliar impacto de segurança;
- verificar testes existentes.

Ao finalizar:

- executar lint;
- executar testes;
- atualizar documentação quando necessário;
- informar arquivos alterados.

### Restrições Arquiteturais

- sem acesso direto do frontend ao banco de negócio;
- sem microserviços no MVP;
- sem filas/event streaming no MVP;
- sem integração real com equipamentos no MVP.

---

## Portabilidade

### Containers

- Docker poderá ser usado para padronizar ambiente da API.
- Não é requisito para execução do frontend na Vercel.

### Banco de Dados

Ambiente local:

- PostgreSQL local/container ou projeto Supabase de desenvolvimento.

Produção:

- PostgreSQL no Supabase.

### Independência de Fornecedor

- Prisma reduz acoplamento de acesso a dados.
- PostgreSQL padrão.
- identidade encapsulada em módulo de autenticação.
- serviços externos configurados por ambiente.

### Infraestrutura

- IaC fora do MVP.

---

## Observabilidade

### Sentry

Instrumentar:

- erros não tratados no frontend;
- erros não tratados no backend;
- informações de contexto sem dados sensíveis.

### Correlação

O backend deve gerar/propagar `request_id`.

### Logs Estruturados

Evitar `console.log()` como estratégia de produção.

Campos mínimos:

- timestamp;
- level;
- service;
- request_id;
- route;
- status;
- duration.

### Métricas

No MVP:

- erros por rota via Sentry;
- métricas básicas oferecidas pelas plataformas.

Evolução:

- latência;
- taxa de erro;
- throughput;
- SLA de chamados.

---

## Evolução Planejada

### Infraestrutura

- containerização completa;
- ambiente staging;
- IaC.

### Armazenamento

- anexos em object storage.

### Comunicação

- notificações;
- e-mail;
- mensageria.

### Plataformas

- PWA ou aplicativo móvel caso validado.

### Funcionalidades

- base de conhecimento;
- IA para sugestão de diagnóstico;
- integrações com ferramentas de rede;
- SLA;
- relatórios.

---

## Limites de Implementação do MVP

É proibido implementar como requisito obrigatório da V1:

- controle remoto de equipamentos;
- integração real com OLT/ONT;
- faturamento;
- CRM comercial completo;
- IA autônoma de diagnóstico;
- microserviços;
- mensageria distribuída.

Esses elementos pertencem a versões futuras do produto.
