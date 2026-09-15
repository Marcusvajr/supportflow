# `.opencode`

Diretório com artefatos usados pelo OpenCode no fluxo do SupportFlow.

## Estrutura

- `commands/` — comandos instalados pelo OpenSpec;
- `skills/` — skills disponíveis no OpenCode;
- `prompts/` — prompts de planejamento, geração e ajuste de testes Playwright.

## Inicialização

```powershell
openspec init --tools antigravity,opencode
```

O arquivo `opencode.json` na raiz contém provider e MCPs do projeto. As credenciais reais continuam fora do Git.

MCPs configurados/preparados:

- Context7;
- Stitch;
- Playwright Test;
- Playwright MCP oficial;
- SonarQube, mantido desabilitado até existir servidor/token local.

A inspeção SonarQube está documentada em `docs/sonarqube.md`.
