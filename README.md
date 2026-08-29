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

A variável `OMNIROUTE_API_KEY` está declarada em `.env.example` e recebe o valor real apenas no arquivo `.env` local.

O OmniRoute foi executado localmente via Docker, configurado com OpenRouter e com o perfil de compressão **Stacked (RTK → Caveman)**. O OpenCode foi conectado ao OmniRoute e validado com uma chamada real de modelo.

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

### Validações locais realizadas

- [x] Google Antigravity IDE instalado, aberto e com o SupportFlow carregado.
- [x] Agent do Antigravity validado com acesso aos arquivos do projeto.
- [x] Node.js/npm validados.
- [x] Git validado.
- [x] Docker/Docker Compose validados.
- [x] OpenSpec validado.
- [x] Playwright validado.
- [x] `.env` local criado e protegido pelo `.gitignore`.
- [x] `OMNIROUTE_API_KEY` configurada localmente.
- [x] Conta OpenRouter criada/utilizada como provider Open Source AI.
- [x] OmniRoute instalado/iniciado via Docker e API key criada.
- [x] OpenRouter configurado e testado no OmniRoute.
- [x] Compression Settings configurado com perfil **Stacked (RTK → Caveman)**.
- [x] OpenCode instalado e reconhecendo o provider OmniRoute.
- [x] Modelos `OmniRoute Auto` e `OmniRoute Auto Coding` disponíveis.
- [x] Chamada real pelo OpenCode validada com sucesso.
- [x] MCPs Context7, Playwright Test e Stitch exibidos como conectados no OpenCode.

### Acessos ainda a conferir para concluir todos os pré-requisitos do roteiro

- [ ] Vercel — conta/login e token.
- [ ] Supabase — conta/login e access token.
- [ ] Clerk — conta/login e chaves da aplicação.
- [ ] Context7 — conta/login e API key no `.env` local.
- [ ] Google Stitch — API key no `.env` local.

As credenciais reais permanecem somente no ambiente local e não são versionadas no GitHub.
