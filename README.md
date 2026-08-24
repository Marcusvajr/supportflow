# SupportFlow

Aplicação web para centralização e acompanhamento de chamados técnicos em provedores de internet.

## Projeto acadêmico

Projeto incremental desenvolvido para a disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

## Documentação

- [`docs/problem.md`](docs/problem.md) — definição do problema.
- [`docs/prd.md`](docs/prd.md) — requisitos do produto.
- [`docs/spec.md`](docs/spec.md) — especificação técnica.
- [`docs/architecture.md`](docs/architecture.md) — arquitetura.
- [`docs/design.md`](docs/design.md) — design system.
- [`docs/delivery-configuration.md`](docs/delivery-configuration.md) — configuração das seções 1 a 4 do Delivery.

## Protótipo

Protótipo criado no Google Stitch com base no PRD, especificação e Design System.

**Stitch:** https://stitch.withgoogle.com/projects/5301597292888761257

Telas principais:

- Login
- Dashboard
- Lista de Chamados
- Novo Chamado
- Detalhes do Chamado
- Lista de Clientes
- Detalhes do Cliente

Foram explorados Preview, Variations e protótipo interativo.

## Stack priorizada

- Frontend: Next.js + React + TypeScript
- Backend: Node.js + NestJS
- Banco: PostgreSQL / Supabase
- ORM: Prisma
- Autenticação: Clerk
- CI/CD: GitHub Actions
- Deploy frontend: Vercel
- Observabilidade: Sentry
- E2E: Playwright
- Prototipação: Google Stitch
- Agente de IA: Google Antigravity
- SDD: OpenSpec

## Estrutura alvo

```text
supportflow/
├── apps/
│   ├── web/
│   └── api/
├── docs/
├── scripts/
├── .agents/
├── openspec/
├── AGENTS.md
├── .env.example
├── .gitignore
└── README.md
```

## Configuração inicial do Delivery

As seções 1 a 4 do roteiro estão documentadas em [`docs/delivery-configuration.md`](docs/delivery-configuration.md).

### 1. Criar o `.env` local

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha as credenciais apenas no `.env` local. O arquivo está ignorado pelo Git e **não deve ser enviado ao GitHub**.

### 2. Instalar skills do agente

```powershell
./scripts/setup-agent-skills.ps1
```

Depois verifique `.agents/skills/`.

### 3. Configurar MCP no Antigravity

Use como referência:

- [`docs/antigravity-mcp.example.json`](docs/antigravity-mcp.example.json)

Configure localmente as chaves do Stitch e Context7 e teste no Agent com:

```text
Liste os projetos do Stitch
```

O projeto esperado é **SupportFlow**.

## Regras para agentes

As regras operacionais do projeto estão em [`AGENTS.md`](AGENTS.md), incluindo:

- arquitetura;
- segurança;
- qualidade e testes;
- autonomia no terminal;
- uso do Context7;
- critérios de conclusão.

## Status

### Discovery

- [x] Problem Statement
- [x] PRD
- [x] Especificação
- [x] Arquitetura
- [x] Design System
- [x] Protótipos no Stitch
- [x] Preview / Variations / Interact

### Delivery — configuração (seções 1 a 4)

- [x] Documentação disponível em `docs/`
- [x] `.gitignore` configurado
- [x] `.env.example` criado
- [x] README atualizado
- [x] `AGENTS.md` criado
- [x] Script de instalação de skills preparado
- [x] Exemplo de MCP preparado
- [ ] Pré-requisitos validados no computador local
- [ ] `.env` local preenchido
- [ ] Skills instaladas localmente
- [ ] MCP Stitch e Context7 configurados/testados no Antigravity

Os itens locais não são marcados como concluídos até serem realmente executados e validados no computador do desenvolvedor.
