# Tasks — Change 01 Project Foundation

## 1. Estrutura

- [x] Criar `package.json` raiz com npm workspaces.
- [x] Criar `apps/web` com configuração base de Next.js/TypeScript.
- [x] Criar `apps/api` com configuração base de NestJS/TypeScript.

## 2. Backend

- [x] Criar bootstrap da API.
- [x] Configurar prefixo `api/v1` por padrão.
- [x] Criar endpoint `GET /api/v1/health`.
- [x] Criar teste unitário do health controller.

## 3. Frontend

- [x] Criar layout raiz.
- [x] Criar página inicial de fundação do SupportFlow.
- [x] Criar estilos mínimos sem regras de negócio.

## 4. Qualidade e automação

- [x] Criar scripts raiz `lint`, `test` e `build`.
- [x] Criar workflow inicial de CI no GitHub Actions.
- [ ] Executar `npm install` no ambiente local para gerar/atualizar `package-lock.json`.
- [ ] Executar `npm run lint` localmente.
- [ ] Executar `npm run test` localmente.
- [ ] Executar `npm run build` localmente.
- [ ] Confirmar CI verde após instalação das dependências e commit do lockfile.

## 5. Revisão

- [x] Manter `.env` fora do versionamento.
- [x] Não introduzir regra de negócio no frontend.
- [x] Documentar riscos e dependências.

> As tarefas que dependem de execução no computador local permanecem abertas até que os comandos sejam efetivamente executados e validados.
