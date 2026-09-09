# `.agents` — preparação da Seção 4

O SupportFlow utiliza `AGENTS.md` na raiz como regra principal do agente. Este diretório é reservado para os artefatos instalados pelo OpenSpec e pelas skills universais indicadas no roteiro de Delivery.

## Inicialização local prevista

Na raiz do projeto:

```powershell
openspec init --tools antigravity,opencode
./scripts/setup-agent-skills.ps1
```

O primeiro comando deve criar/atualizar comandos, regras, skills e workflows compatíveis com Antigravity e OpenCode. O segundo instala as skills adicionais listadas no roteiro da disciplina.

## MCPs

As credenciais de Stitch e Context7 permanecem somente no `.env` local. O exemplo de configuração para Antigravity está em `docs/antigravity-mcp.example.json`; a configuração do OpenCode está em `opencode.json`.

## Segurança

Não versionar tokens, API keys ou qualquer valor real de `.env` neste diretório.
