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

As chaves dos providers são configuradas localmente no OmniRoute e não são versionadas no repositório.

## 2. OmniRoute

Instalar o OmniRoute conforme a documentação oficial do projeto.

Em Windows, caso a instalação padrão apresente problemas, pode ser utilizada a alternativa via Docker:

```powershell
docker run -d --name omniroute --restart unless-stopped --stop-timeout 40 -p 20128:20128 -v omniroute-data:/app/data diegosouzapw/omniroute:latest
```

Após iniciar o OmniRoute, acessar:

```text
http://localhost:20128/
```

No dashboard:

1. abrir **API Key Manager**;
2. criar uma API key;
3. guardar a chave em local seguro e preencher `OMNIROUTE_API_KEY` no `.env` local;
4. abrir **Providers** e configurar os providers escolhidos;
5. abrir **Compression Settings** e selecionar **Stacked**.

## 3. OpenCode

Instalar o OpenCode e utilizá-lo pelo VS Code ou por uma integração compatível.

Na interface do OpenCode:

```text
/connect
```

Selecionar/configurar o provider OmniRoute e, depois, consultar os modelos:

```text
/models
```

Podem ser priorizados modelos recentes e gratuitos das famílias DeepSeek, Qwen, Kimi, GLM e MiniMax, conforme disponibilidade dos providers configurados.

## 4. Configuração do agente

O arquivo `opencode.json` foi criado na raiz do SupportFlow e contém:

- provider OmniRoute;
- MCP Playwright Test;
- MCP Google Stitch;
- MCP Context7.

As credenciais são referenciadas por variáveis de ambiente e não ficam gravadas diretamente no JSON.

> Observação: o exemplo disponibilizado no roteiro possui um bloco `mcp` duplicado. No SupportFlow foi utilizada a mesma estrutura funcional, corrigindo a duplicação para manter o arquivo JSON válido.

Variáveis utilizadas pelo agente:

```dotenv
OMNIROUTE_API_KEY=
STITCH_API_KEY=
CONTEXT7_API_KEY=
```

O OpenCode também pode consumir skills e outros recursos armazenados no diretório `.agents` quando essas etapas forem necessárias posteriormente no projeto.

## Checklist desta entrega

### Repositório

- [x] Documentação `problem.md` disponível.
- [x] Documentação `prd.md` disponível.
- [x] Documentação `spec.md` disponível.
- [x] Documentação `design.md` disponível.
- [x] Documentação `architecture.md` disponível.
- [x] `.gitignore` protegendo `.env`.
- [x] `.env.example` sem segredos reais.
- [x] README disponível.
- [x] `OMNIROUTE_API_KEY` adicionada ao exemplo de ambiente.
- [x] `opencode.json` criado para a preparação Open Source AI.

### Execução local

- [ ] Antigravity instalado e validado.
- [ ] Node.js/npm instalados e validados.
- [ ] Git instalado e validado.
- [ ] Docker/Docker Compose instalados e validados.
- [ ] OpenSpec instalado e validado.
- [ ] Playwright instalado e validado.
- [ ] `.env` local criado e credenciais preenchidas.
- [ ] Conta(s) de provider Open Source AI criada(s).
- [ ] OmniRoute instalado/iniciado e API key criada.
- [ ] Provider(s) configurado(s) no OmniRoute.
- [ ] Compression Settings configurado como Stacked.
- [ ] OpenCode instalado e conectado ao OmniRoute.
- [ ] Modelo do OmniRoute selecionado/testado no OpenCode.

Os itens locais só devem ser marcados após serem realmente executados no computador do desenvolvedor.
