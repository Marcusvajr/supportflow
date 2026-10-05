# Revisão de código e validação — 05/10/2026

## Base e escopo

Revisão iniciada no `main` em `5704f1efd67751d95e4f3e21e1f6814f562a3398`.
As alterações foram preparadas em checkout isolado, preservando os arquivos
locais da revisão anterior. Não foram alterados segredos, papéis, migrations
ou configurações de Render/Clerk/Supabase.

## Correções

### Configuração vazia do provedor de IA

O operador `??` aceitava strings vazias como configuração válida. Assim,
`AI_API_KEY` vazia impedia o uso de `OPENROUTER_API_KEY`; URL e modelo vazios
impediam seus valores padrão. O provedor agora remove espaços nas extremidades
e usa a primeira configuração não vazia. Uma chave primária válida continua
com precedência. Sem nenhuma chave válida, retorna indisponibilidade antes
de qualquer requisição externa.

Três testes adicionais cobrem fallback, precedência/configuração explícita e
rejeição de credenciais compostas apenas por espaços. As chamadas do provedor
nesses testes são simuladas; não demonstram geração real de IA.

### Clientes disponíveis no formulário de chamado

O formulário consultava somente a primeira página de 100 clientes. Agora
`loadCustomerOptions` percorre as páginas autenticadas da API até completar a
coleção informada pelo servidor. Uma falha de página interrompe o carregamento,
em vez de oferecer uma lista parcial sem aviso. Página vazia incompatível com
o total é rejeitada para evitar repetição indefinida de requisições.

Quatro testes adicionais cobrem 205 clientes em três páginas, base vazia,
falha em página posterior e resposta inconsistente. A abordagem preserva o
seletor atual e atende à base acadêmica; busca remota pode substituí-la em uma
futura operação com grandes cadastros.

### Documentação de entrega

README, arquitetura, Delivery e roteiro de apresentação distinguem a V3 atual
do planejamento da V1. Os relatórios antigos foram preservados como evidência
histórica. Prisma, Tailwind, React Hook Form, Zod e Sentry não são apresentados
como tecnologias já comprovadas nesta implementação.

## Validação desta revisão

| Verificação | Resultado |
|---|---|
| TypeScript web/API (`npm run lint`) | Aprovado |
| Unidade web | 8 aprovados |
| Unidade/HTTP API | 42 aprovados |
| Total unidade/HTTP | 50 aprovados, 0 falhas |
| Build Next.js e NestJS | Aprovado |
| Audit de produção na base revisada, sem mudança de dependências | 0 vulnerabilidades |
| Navegador autenticado e geração real de IA | Não repetidos nesta revisão |
| Containers e Playwright smoke desta alteração | Consultar CI do PR; não executados localmente |

Neste executor, `tsx --test` encontra restrição no socket IPC. Foram usados
os comandos equivalentes abaixo, cada um no respectivo workspace para que
os decorators da API usem seu `tsconfig.json`:

```sh
# Em apps/web
node --import tsx --test tests/unit/*.test.ts
# Em apps/api
node --import tsx --test tests/*.test.ts
# Na raiz
npm run lint
npm run build
```

## Evidências manuais anteriores, coletadas em 05/10

As evidências abaixo foram obtidas na aplicação publicada, antes destas
correções, e não representam execução da suíte Playwright de negócio:

| Cenário | Evidência |
|---|---|
| Atendimento completo do agente | `SF-2026-000002`: criação, TEST, DIAGNOSIS e resolução; dados preservados após reload |
| Escalonamento | `SF-2026-000003`: NOTE e transição OPEN → ESCALATED |
| Persistência | Consulta de leitura no Supabase confirmou estados, atividades e eventos de auditoria dos dois chamados |
| Busca e dashboard | Busca por protocolo, filtro de status, 1 resolvido e 1 encaminhado |
| IA publicada | POST `ai-summary` retornou 503 às 15:59:12 UTC; log com request ID e duração, sem causa específica |
| Conta disponível | Atendente; reatribuição e reabertura com supervisor não executadas no navegador |

## Pendências externas mantidas

1. Conferir configuração do provedor de IA e demonstrar um resumo real. A
   correção de strings vazias não comprova a causa nem a resolução do 503
   observado no ambiente publicado.
2. Validar conta de supervisor associada a `DEMO_SUPERVISOR_CLERK_ID` e executar
   reatribuição, continuidade, resolução e reabertura com sessão real.
3. A suíte `chromium-business` exige `E2E_BUSINESS_ENABLED=true`, configuração
   Clerk e contas fictícias de atendente/supervisor. O CI smoke não executa
   esses dois cenários e não deve ser apresentado como evidência deles.

Usuário autorizou adiar a configuração externa enquanto estava sem acesso ao
computador. Nenhuma autenticação foi desativada para executar os testes.
