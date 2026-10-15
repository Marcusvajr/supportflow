# Checklist da apresentação — 14/10/2026, 19h

## Aplicação e materiais

- [x] Documentação de produto: problema, Lean Canvas, personas, jornada, histórias, PRD e especificações.
- [x] Modelos de contexto, contêineres, componentes, classes e implantação.
- [x] Autenticação Clerk, autorização AGENT/SUPERVISOR e persistência Supabase implementadas.
- [x] Dashboard autenticado da Vercel consultado em 14/10: dois clientes e chamados existentes na data da verificação.
- [x] Chamado `SF-2026-000002` consultado com teste, diagnóstico, resolução e histórico preservados.
- [x] API e frontend Render responderam HTTP 200 nos health checks.
- [x] Roteiro atualizado em [presentation-v3.md](presentation-v3.md).

## Validação da atualização de dependências

- [x] Instalação limpa com `npm ci`.
- [x] Lint/TypeScript.
- [x] 45 testes da API e 12 testes do frontend aprovados localmente.
- [x] Build Next.js e NestJS.
- [x] `npm audit --omit=dev --audit-level=high`: zero vulnerabilidades na verificação de 14/10.

No ambiente local desta revisão, os testes usaram `node --import tsx --test` devido à restrição de IPC do executável `tsx`. O CI mantém o comando normal `npm run test`.

O resultado de containers, Playwright smoke e empacotamento deve ser conferido na execução do commit entregue em [GitHub Actions](https://github.com/Marcusvajr/supportflow/actions). Os registros anteriores do CI não comprovam uma execução nova. O ZIP final é produzido pelo workflow quando todas as etapas passam.

## Funcionalidades e IA

- [x] Catálogo detalhado disponível em [docs/funcionalidades.md](funcionalidades.md), com propósito, operação e limitações.
- [x] Frontend preparado com navegação para uma página pública de recursos e descrição das funcionalidades; conferir o deploy desta atualização antes de divulgar o novo endereço.
- [x] Implementação identificada para botão e endpoint do resumo assistivo por IA.
- [x] **Resumo por IA com inferência real:** a requisição autenticada no Render retornou HTTP 201 em 15/10/2026 00:28 UTC, duração 7,6 s, após corrigir o timeout e configurar OpenRouter. A avaliação humana da fidelidade do texto continua recomendada.
- [ ] **Teste de supervisor completo em produção:** não confirmado.
- [ ] **Troca da credencial Clerk antes exposta:** ainda necessária por segurança.

## Escopo e limites conhecidos

- A URL da apresentação é https://supportflow-pi.vercel.app/dashboard. O frontend alternativo do Render ainda mostrou autenticação indisponível; não usar como link de demonstração.
- A verificação de 14/10 reutilizou uma sessão autenticada; não equivale a um novo login desde a entrada de senha.
- O fluxo publicado de supervisor continua sem validação integral. A conta demonstrativa atual é de atendente. A IA ao vivo respondeu com sucesso em teste autenticado.
- Sentry e Prisma não devem ser apresentados como integrações implementadas; há logs estruturados/correlação e persistência pela Data API do Supabase.
- A rotação da chave anteriormente exposta não foi executada nesta revisão, conforme decisão do titular.

## Preparação do apresentador

- [ ] Abrir a Vercel e conferir a conta demonstrativa antes das 19h.
- [ ] Abrir os dois chamados de exemplo, o roteiro e o repositório em abas separadas.
- [ ] Conferir o acesso do professor ao repositório e anexar o ZIP aprovado pelo CI.
- [ ] Informar credenciais de demonstração apenas no canal privado da entrega, nunca no Git.

## Validação complementar — base fictícia (14/10/2026)

- [x] Quatro clientes com prefixo `SF-TEST-` e quatro chamados demonstrativos novos foram gravados e conferidos no PostgreSQL do Supabase.
- [x] Onze atividades técnicas (observação, teste e diagnóstico) e gatilhos de auditoria foram confirmados no banco.
- [x] Estados demonstrativos: em diagnóstico, aberto, encaminhado e resolvido.
- [x] Após a execução: 6 clientes, 7 chamados, 14 atividades técnicas e 31 eventos de auditoria.
- [ ] **Fluxo pelo navegador:** a gravação acima foi realizada diretamente no banco, portanto ainda precisa de prova dos formulários, botões e regras de autorização pela interface.
- [ ] **Acesso do professor:** o e-mail e a senha citados em documento restrito são históricos e ainda precisam de tentativa de login atual; código de verificação não é um código de acesso permanente.
