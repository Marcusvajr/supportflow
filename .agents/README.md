# `.agents` — artefatos do agente

O SupportFlow utiliza `AGENTS.md` na raiz como regra principal do agente. Este diretório reúne os artefatos instalados/configurados para o Antigravity e para o fluxo da disciplina.

## Estrutura utilizada

- `skills/` — skills adicionadas conforme o roteiro;
- `workflows/` — workflows do OpenSpec;
- `prompts/` — prompts de planejamento, geração e ajuste de testes Playwright.

## Inicialização local

Na raiz do projeto:

```powershell
openspec init --tools antigravity,opencode
./scripts/setup-agent-skills.ps1
```

Esses comandos criam/atualizam os artefatos do OpenSpec e instalam as skills adicionais previstas no roteiro.

## MCPs

As credenciais de Stitch e Context7 permanecem somente no `.env` local. O exemplo de configuração para Antigravity está em `docs/antigravity-mcp.example.json`; a configuração do OpenCode está em `opencode.json`.

A etapa de SonarQube está documentada em `docs/sonarqube.md`. O MCP SonarQube só deve ser habilitado depois que o servidor local e o token estiverem configurados.

## Segurança

Não versionar tokens, API keys, senhas ou qualquer valor real de `.env` neste diretório.
