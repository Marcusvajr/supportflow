# Delivery — Configuração (Seções 1 a 4)

Este documento aplica ao **SupportFlow** as seções 1 a 4 do roteiro oficial de Delivery.

> Escopo desta etapa: preparar ambiente, variáveis, documentação, agente de IA, skills e MCP Servers. Não inclui ainda a criação das mudanças do OpenSpec (seção 5 em diante).

## 1. Visão geral do fluxo

Resultados esperados do Delivery ao longo da disciplina:

- roadmap de mudanças;
- propostas de mudança;
- planos e casos de teste;
- incrementos do produto.

Participantes principais:

- Designer UX;
- Desenvolvedor.

Ferramentas priorizadas para o SupportFlow:

- Google Antigravity;
- OpenSpec;
- Playwright;
- GitHub;
- Stitch;
- Context7;
- Vercel;
- Supabase;
- Clerk.

## 2. Orientações gerais

### Pré-requisitos locais

Instalar e validar:

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
openspec --version
```

Também devem existir contas/logins ativos em:

- GitHub;
- Vercel;
- Supabase;
- Clerk;
- Context7;
- Google Stitch.

### Antigravity

Instalar o Google Antigravity localmente e usar o painel **Agent**.

Prática recomendada:

- iniciar uma nova conversa para cada tarefa relevante;
- usar modelos com maior capacidade de raciocínio no planejamento;
- usar modelos mais rápidos na execução quando adequado;
- referenciar arquivos com `@`, por exemplo `@docs/spec.md`.

### Ciclo Planejar / Executar

Para cada tarefa:

1. pesquisar e entender contexto;
2. criar plano;
3. implementar;
4. validar com lint/testes/build aplicáveis;
5. registrar resultado e riscos restantes.

As regras permanentes estão em `AGENTS.md`.

## 3. Configuração do projeto

### Documentação

A pasta `docs/` contém:

```text
docs/
├── architecture.md
├── design.md
├── prd.md
├── problem.md
├── spec.md
└── delivery-configuration.md
```

### Variáveis de ambiente

O arquivo versionado é apenas `.env.example`.

Crie localmente o arquivo `.env` a partir dele:

```powershell
Copy-Item .env.example .env
```

O `.gitignore` já bloqueia `.env` e variantes contendo segredos.

Preencha localmente:

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

FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

### Onde obter as chaves

- Context7: dashboard → API Keys.
- Stitch: Settings → API Key.
- Vercel: Account Settings → Tokens.
- Supabase: Account/Dashboard → Access Tokens e, após criar o projeto, configurações de API/banco.
- Clerk: Application → Configure → API Keys.

Nunca coloque os valores reais no GitHub.

### README

O `README.md` deve permanecer como porta de entrada do projeto e apontar para:

- problema;
- documentação de Discovery;
- protótipo no Stitch;
- stack;
- configuração do Delivery.

## 4. Configuração do Agente de IA

### AGENTS.md

O repositório possui `AGENTS.md` com:

- prioridades;
- stack;
- estrutura alvo;
- limites arquiteturais;
- fluxo de trabalho;
- comandos alvo;
- critérios de qualidade/testes;
- governança de terminal;
- uso do Context7;
- referências da documentação.

Revise esse arquivo sempre que surgir uma regra recorrente, evitando duplicação.

### Skills

No terminal, a partir da raiz do projeto, execute:

```powershell
npx skills add https://github.com/hashicorp/agent-skills --yes --skill terraform-style-guide --agent universal
npx skills add https://github.com/vercel/next.js/tree/canary/skills --yes --agent universal --skill next-best-practices next-cache-components deploy-to-vercel react-best-practices web-design-guidelines composition-patterns
npx skills add https://github.com/prisma/skills --yes --agent universal --skill prisma-database-setup
npx skills add https://github.com/supabase/agent-skills --yes --agent universal
npx skills add https://github.com/clerk/skills --yes --agent universal --skill clerk-setup clerk
npx skills add https://github.com/mattpocock/skills --yes --agent universal --skill improve-codebase-architecture
npx skills add https://github.com/addyosmani/agent-skills --yes --agent universal --skill frontend-ui-engineering code-review-and-quality ci-cd-and-automation
npx skills add https://github.com/sickn33/antigravity-awesome-skills --yes --agent universal --skill backend-architect nestjs-expert docker-expert github-actions-templates
```

Depois confira se `.agents/skills/` foi criado e contém as skills instaladas.

Também há um script auxiliar em `scripts/setup-agent-skills.ps1` com esses comandos.

### MCP Servers no Antigravity

No Antigravity:

1. Agent.
2. `...` → MCP Store.
3. Manage MCP Servers.
4. View raw config.
5. Use a configuração abaixo substituindo os placeholders pelos valores do `.env` local.

```json
{
  "mcpServers": {
    "stitch": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "<STITCH_API_KEY>"
      }
    },
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "<CONTEXT7_API_KEY>"
      }
    }
  }
}
```

Salve e use **Refresh**.

Um exemplo sem credenciais reais também está em `docs/antigravity-mcp.example.json`.

### Teste do MCP do Stitch

Abra uma nova conversa no Agent e solicite:

```text
Liste os projetos do Stitch
```

O projeto esperado é **SupportFlow** (Stitch project ID `5301597292888761257`).

### Teste do Context7

Solicite ao agente uma consulta simples de documentação atualizada, por exemplo:

```text
Use o Context7 para consultar a documentação atual do Next.js App Router e informe a versão/documentação encontrada.
```

## Checklist de conclusão das seções 1 a 4

- [x] Documentação de Discovery no repositório.
- [x] `.gitignore` protege `.env`.
- [x] `.env.example` criado sem segredos.
- [x] README existente.
- [x] `AGENTS.md` criado.
- [ ] Antigravity instalado localmente.
- [ ] Node/npm/Git/Docker/OpenSpec validados localmente.
- [ ] `.env` local criado e preenchido.
- [ ] Skills instaladas localmente em `.agents/skills/`.
- [ ] MCP Stitch configurado e testado no Antigravity.
- [ ] MCP Context7 configurado e testado no Antigravity.

Os itens não marcados exigem execução/autenticação no computador do desenvolvedor e não devem ser simulados por commits no GitHub.
