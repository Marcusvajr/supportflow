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
- [`docs/delivery-configuration.md`](docs/delivery-configuration.md) — preparação do ambiente, seções 1, 2 e 3 do Delivery e complemento Open Source AI.

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
- Agente de IA: Google Antigravity / OpenCode
- SDD: OpenSpec
- Gateway Open Source AI: OmniRoute

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
├── opencode.json
└── README.md
```

## Preparação do ambiente — Delivery

As seções **1, 2 e 3** do roteiro de Delivery e a preparação complementar do ambiente **Open Source AI** estão documentadas em [`docs/delivery-configuration.md`](docs/delivery-configuration.md).

### 1. Criar o `.env` local

No Windows/PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha as credenciais apenas no `.env` local. O arquivo está ignorado pelo Git e **não deve ser enviado ao GitHub**.

### 2. Validar os pré-requisitos

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
openspec --version
npx playwright --version
```

Também devem estar disponíveis Google Antigravity, VS Code/OpenCode e os acessos aos serviços definidos no roteiro.

### 3. Preparar o ambiente Open Source AI

O projeto inclui [`opencode.json`](opencode.json), preparado para integração com:

- OmniRoute;
- Playwright Test MCP;
- Google Stitch MCP;
- Context7 MCP.

A variável `OMNIROUTE_API_KEY` está declarada em `.env.example` e deve receber o valor real apenas no arquivo `.env` local.

O OmniRoute deve ser iniciado localmente e configurado com ao menos um provider. Em seguida, o OpenCode deve ser conectado ao OmniRoute e um modelo disponível deve ser selecionado/testado.

## Status da preparação

### Arquivos do repositório

- [x] Documentação de Discovery disponível em `docs/`.
- [x] `.gitignore` configurado para proteger `.env`.
- [x] `.env.example` criado sem credenciais reais.
- [x] README atualizado.
- [x] `OMNIROUTE_API_KEY` adicionada ao exemplo de ambiente.
- [x] `opencode.json` criado.
- [x] Preparação das seções 1, 2 e 3 documentada.
- [x] Preparação Open Source AI documentada.

### Validações locais

- [ ] Antigravity validado.
- [ ] Node.js/npm validados.
- [ ] Git validado.
- [ ] Docker/Docker Compose validados.
- [ ] OpenSpec validado.
- [ ] Playwright validado.
- [ ] `.env` local preenchido.
- [ ] OmniRoute instalado e configurado.
- [ ] Provider Open Source AI configurado.
- [ ] OpenCode conectado ao OmniRoute.
- [ ] Modelo selecionado e testado.

Os itens locais devem ser marcados somente após execução real no computador do desenvolvedor.
