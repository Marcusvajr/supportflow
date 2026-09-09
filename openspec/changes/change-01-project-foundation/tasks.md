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

- [x] Criar scripts raiz `dev`, `lint`, `test`, `test:e2e` e `build`.
- [x] Configurar Playwright para smoke tests de frontend e health check.
- [x] Criar workflow de CI com verificação estática, teste unitário, build e E2E smoke.
- [x] Validar no GitHub Actions: instalação de dependências, verificação estática, teste unitário, build, instalação do Chromium e testes E2E smoke concluídos com sucesso.
- [ ] Executar `npm install` no ambiente local para gerar/atualizar `package-lock.json`.
- [ ] Executar `npm run lint` localmente.
- [ ] Executar `npm run test` localmente.
- [ ] Executar `npm run build` localmente.
- [ ] Executar `npm run test:e2e` localmente.

## 5. Revisão

- [x] Manter `.env` fora do versionamento.
- [x] Não introduzir regra de negócio no frontend.
- [x] Documentar riscos e dependências.

> A fundação já foi validada automaticamente pelo CI. As tarefas locais permanecem abertas apenas para reproduzir a mesma validação no computador de desenvolvimento e gerar o lockfile antes da entrega final.