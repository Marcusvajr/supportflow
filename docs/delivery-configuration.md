# Delivery — Preparação do ambiente (Seções 1, 2 e 3)

Este documento aplica ao **SupportFlow** as seções 1, 2 e 3 do roteiro de Delivery e inclui a preparação complementar do ambiente **Open Source AI**.

> Escopo desta entrega: visão geral do fluxo, orientações gerais, pré-requisitos, configuração do projeto, variáveis de ambiente, README e preparação de OmniRoute/OpenCode. Não inclui etapas posteriores do roteiro de Delivery.

## 1. Visão geral do fluxo

Resultados esperados ao longo do Delivery:

- roadmap de mudanças;
- propostas de mudança;
- planos de testes;
- casos de teste;
- incrementos do produto.

Participantes:

- Designer UX;
- Desenvolvedor.

Ferramentas previstas:

- agentes de IA para desenvolvimento, como Google Antigravity e OpenCode;
- OpenSpec para Spec-Driven Development;
- Playwright para automação de testes;
- GitHub, Vercel, Supabase, Clerk, Context7 e Google Stitch.

## 2. Orientações gerais

### Pré-requisitos

Devem estar instalados localmente:

- Google Antigravity IDE;
- Node.js e npm;
- Git;
- Docker e Docker Compose;
- OpenSpec;
- Playwright;
- VS Code/OpenCode para o fluxo Open Source AI.

Comandos sugeridos para validação:

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
openspec --version
npx playwright --version
```

Também devem existir contas e logins ativos em:

- GitHub;
- Vercel;
- Supabase;
- Clerk;
- Context7;
- Google Stitch.

### Gerenciamento da janela de contexto

Para cada tarefa relevante, priorizar uma nova conversa no agente de IA. No Antigravity, utilizar o painel **Agent** e iniciar uma nova conversa.

### Ciclo Planejar / Executar

As tarefas devem seguir, sempre que possível, o ciclo:

1. pesquisar e entender o contexto;
2. planejar a solução;
3. implementar;
4. validar o resultado.

No planejamento, priorizar modelos com maior capacidade de raciocínio. Para execução, podem ser utilizados modelos mais rápidos quando adequado.

### Ajuste nos prompts

- substituir valores entre `< >` pelos dados reais do SupportFlow;
- utilizar `@` para referenciar arquivos, diretórios, regras ou MCP servers disponíveis no agente.

## 3. Configuração do projeto

### Documentação geral

O repositório possui a documentação exigida em `docs/`:

```text
docs/
├── architecture.md
├── design.md
├── prd.md
├── problem.md
└── spec.md
```

### Variáveis de ambiente

O repositório mantém apenas o arquivo seguro `.env.example` versionado.

No Windows/PowerShell, criar o arquivo local `.env` com:

```powershell
Copy-Item .env.example .env
```

As credenciais reais devem ser preenchidas somente no `.env` local.

Principais variáveis utilizadas:

```dotenv
PROJECT_NAME=SupportFlow
GLOBAL_PREFIX=api/v1

CONTEXT7_API_KEY=
STITCH_API_KEY=
VERCEL_API_TOKEN=

SUPABASE_ACCESS_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_KEY=""

OMNIROUTE_API_KEY=

FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

As chaves podem ser obtidas nos painéis dos respectivos serviços. Nenhum segredo deve ser enviado ao GitHub.

### `.gitignore`

O `.gitignore` do projeto ignora `.env` e suas variantes, mantendo apenas `.env.example` versionado.

### README

O `README.md` funciona como porta de entrada do repositório e apresenta:

- objetivo do SupportFlow;
- documentação do Discovery;
- protótipo no Stitch;
- stack priorizada;
- estrutura do projeto;
- instruções de configuração inicial.

---

# Preparação complementar — Ambiente Open Source AI

A preparação Open Source AI segue a orientação complementar indicada no roteiro de Delivery.

## 1. Providers

Podem ser utilizadas contas em provedores com modelos gratuitos ou free tier, por exemplo:

- Ollama Cloud;
- OpenRouter;
- AgentRouter;
- Groq;
- OpenCode Zen;
- OpenCode Go;
- Alibaba Model Studio;
- NVIDIA Build.

No ambiente validado para o SupportFlow foi utilizado **OpenRouter** como provider conectado ao OmniRoute.

As chaves dos providers são configuradas localmente no OmniRoute e não são versionadas no repositório.

## 2. OmniRoute

Em Windows, o OmniRoute foi executado via Docker com:

```powershell
docker run -d --name omniroute --restart unless-stopped --stop-timeout 40 -p 20128:20128 -v omniroute-data:/app/data diegosouzapw/omniroute:latest
```

Dashboard local:

```text
http://localhost:20128/
```

Configuração validada:

1. API key criada no Gerenciador API;
2. `OMNIROUTE_API_KEY` preenchida no `.env` local;
3. OpenRouter configurado como provider;
4. teste de conexão do provider concluído com sucesso;
5. Prompt Compression ativado;
6. perfil global **Stacked** selecionado, executando `RTK → Caveman`.

## 3. OpenCode

O OpenCode foi instalado e executado dentro do projeto SupportFlow.

O arquivo `opencode.json` registra o provider OmniRoute e os MCP servers utilizados pelo projeto.

Modelos disponibilizados:

- `OmniRoute Auto`;
- `OmniRoute Auto Coding`.

Foi executado um teste real pelo OpenCode com resposta bem-sucedida através do OmniRoute.

## 4. Configuração do agente

O arquivo `opencode.json` na raiz do SupportFlow contém:

- provider OmniRoute;
- MCP Playwright Test;
- MCP Google Stitch;
- MCP Context7.

O endpoint local utilizado pelo OpenCode é:

```text
http://localhost:20128/v1
```

Os MCPs **Context7**, **Playwright Test** e **Stitch** foram exibidos como conectados na validação do OpenCode.

> Observação: o exemplo disponibilizado no roteiro possui um bloco `mcp` duplicado. No SupportFlow foi utilizada uma estrutura JSON válida, mantendo o objetivo funcional do roteiro.

## 5. Google Antigravity

O Google Antigravity foi instalado e validado localmente em duas frentes:

- Agent com acesso ao projeto SupportFlow e leitura dos arquivos da pasta `docs/`;
- Antigravity IDE instalado e aberto com o repositório `SupportFlow` carregado.

## Checklist desta entrega

### Repositório

- [x] Documentação `problem.md` disponível.
- [x] Documentação `prd.md` disponível.
- [x] Documentação `spec.md` disponível.
- [x] Documentação `design.md` disponível.
- [x] Documentação `architecture.md` disponível.
- [x] `.gitignore` protegendo `.env`.
- [x] `.env.example` sem segredos reais.
- [x] README disponível e atualizado.
- [x] `OMNIROUTE_API_KEY` adicionada ao exemplo de ambiente.
- [x] `opencode.json` criado para a preparação Open Source AI.

### Execução local validada

- [x] Google Antigravity IDE instalado e validado.
- [x] Antigravity Agent validado com acesso ao SupportFlow.
- [x] Node.js/npm instalados e validados.
- [x] Git instalado e validado.
- [x] Docker/Docker Compose instalados e validados.
- [x] OpenSpec instalado e validado.
- [x] Playwright instalado e validado.
- [x] `.env` local criado.
- [x] `OMNIROUTE_API_KEY` configurada localmente.
- [x] Conta OpenRouter utilizada como provider Open Source AI.
- [x] OmniRoute iniciado via Docker e API key criada.
- [x] OpenRouter configurado e testado no OmniRoute.
- [x] Compression Settings configurado com **Stacked (RTK → Caveman)**.
- [x] OpenCode instalado e reconhecendo o provider OmniRoute.
- [x] Modelos OmniRoute carregados no OpenCode.
- [x] Teste real de chamada pelo OpenCode concluído com sucesso.
- [x] MCPs Context7, Playwright Test e Stitch exibidos como conectados.

### Acessos/credenciais ainda a conferir no ambiente local

- [ ] Vercel — conta/login e `VERCEL_API_TOKEN`.
- [ ] Supabase — conta/login e `SUPABASE_ACCESS_TOKEN`.
- [ ] Clerk — conta/login e chaves da aplicação.
- [ ] Context7 — conta/login e `CONTEXT7_API_KEY` no `.env` local.
- [ ] Google Stitch — `STITCH_API_KEY` no `.env` local.

Os itens restantes correspondem à conferência das credenciais exigidas pela seção 3. As chaves reais devem permanecer somente no `.env` local e nunca ser versionadas no GitHub.
