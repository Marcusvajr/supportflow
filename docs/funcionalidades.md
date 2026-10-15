# Funcionalidades do SupportFlow — guia e evidências

> Projeto acadêmico de gestão de chamados técnicos de provedores de internet. Estado verificado em 14/10/2026. **Implementação no código não significa teste completo em ambiente publicado.** A aplicação usa dados fictícios.

## Catálogo das funcionalidades

| Recurso | O que faz | Estado da validação |
|---|---|---|
| Acesso seguro e sessão | Autenticação pelo Clerk e proteção de páginas privadas. O usuário entra com sua conta, recebe uma sessão e usa o sistema conforme a autorização concedida. | Implementado no código; conferir cenários reais conforme testes |
| Papéis e permissões | Perfis de atendente e supervisor, com verificações no backend. Atendentes realizam atividades de suporte; determinadas ações, como reatribuir responsáveis e reabrir chamados resolvidos, exigem supervisor. Fluxo completo de supervisor publicado ainda precisa de validação. | Implementado; fluxo completo de supervisor em ambiente publicado pendente |
| Painel operacional | Indicadores, visão da fila e atalhos de atendimento. O dashboard consulta os chamados e apresenta métricas para acompanhar a operação. | Implementado no código; conferir cenários reais conforme testes |
| Gestão de clientes | Cadastro, consulta, busca e atualização de clientes fictícios. Os dados ficam armazenados no PostgreSQL do Supabase e são associados aos chamados. | Implementado no código; conferir cenários reais conforme testes |
| Abertura de chamado | Registro de cliente, descrição, categoria e prioridade com protocolo único. A API valida os campos, cria o atendimento e mantém a referência para consultas posteriores. | Implementado no código; conferir cenários reais conforme testes |
| Fila, pesquisa e filtros | Localização de chamados por pesquisa, status, prioridade e outras informações disponíveis. A listagem facilita encontrar e acompanhar atendimentos, com paginação conforme o fluxo implementado. | Implementado no código; conferir cenários reais conforme testes |
| Detalhes e contexto | Visão unificada dos dados do chamado e do cliente. O profissional consulta a descrição, os responsáveis, as atividades e a evolução do caso. | Implementado no código; conferir cenários reais conforme testes |
| Situação do atendimento | Evolução entre aberto, em diagnóstico, encaminhado e resolvido. As transições seguem regras de negócio; a reabertura de chamado resolvido é restrita ao supervisor. | Implementado no código; conferir cenários reais conforme testes |
| Prioridades | Classificação em baixa, média, alta e crítica. Ajuda a organizar a fila e destacar chamados com maior urgência. | Implementado no código; conferir cenários reais conforme testes |
| Atividades técnicas | Registro de observações, testes e diagnósticos. Cada registro descreve o que foi feito ou identificado para evitar repetição de procedimentos. | Implementado no código; conferir cenários reais conforme testes |
| Resolução | Encerramento com descrição obrigatória da solução aplicada. A resolução é preservada para consulta posterior e registrada no histórico. | Implementado no código; conferir cenários reais conforme testes |
| Linha do tempo e auditoria | Histórico cronológico de atividades e alterações relevantes. Permite acompanhar testes, diagnósticos, responsáveis e mudanças de estado. | Implementado no código; conferir cenários reais conforme testes |
| Resumo assistivo por IA | Geração opcional de uma síntese dos fatos registrados no chamado. A interface e a rota de API estão implementadas, mas dependem de um provedor externo com credenciais válidas. Após corrigir o timeout, houve geração real confirmada no Render (HTTP 201 em 15/10/2026 00:28 UTC; 7,6 s). A IA não altera o chamado e exige revisão humana. | Implementado; teste autenticado real aprovado |

## Como demonstrar (sem alterar dados reais)

1. Acesse o frontend da Vercel e conclua a autenticação com uma conta de demonstração.
2. Abra **Visão geral** para consultar indicadores e atalhos.
3. Em **Clientes**, pesquise e visualize registros fictícios.
4. Em **Chamados**, use busca e filtros por status/prioridade; abra um caso de demonstração.
5. Nos detalhes, mostre categoria, prioridade, responsável, observações, testes, diagnósticos, resolução e linha do tempo.
6. Explique reatribuição/reabertura como ações restritas ao supervisor; não as execute com conta de atendente.
7. Explique o botão de resumo por IA como **opcional e dependente de provedor externo**. Uma geração real foi confirmada em 15/10/2026; avise que a fidelidade de cada resumo deve ser conferida pelo atendente.

## Resumo assistivo por IA: funcionamento e diagnóstico

- Interface: tela de detalhes de um chamado, ação **Gerar resumo por IA**.
- Endpoint: `POST /api/v1/tickets/:id/ai-summary` (requer sessão autenticada).
- O backend reúne título, descrição, cliente, categoria, status, prioridade, resolução e até 30 eventos recentes da linha do tempo.
- O provedor OpenAI-compatible é configurado pelo servidor por `AI_PROVIDER_URL`, `AI_MODEL` e uma credencial em `AI_API_KEY` ou `OPENROUTER_API_KEY`. Não armazene a chave no frontend, nos slides ou no Git.
- Sem credencial, erro de rede, resposta inválida ou falha do provedor, a API devolve indisponibilidade controlada e **não altera o atendimento**.
- **Evidência de limitação atual:** logs da API Render registraram respostas HTTP 503 em três chamadas do endpoint em 14/10/2026 (14:57, 17:29 e 18:03 UTC). Após configuração do provedor e correção do timeout, o endpoint respondeu HTTP 201 em 15/10/2026 00:28 UTC, concluindo uma geração real em aproximadamente 7,6 s.
- **Para concluir:** configurar/validar credenciais exclusivamente no servidor, testar um chamado fictício em ambiente controlado, verificar HTTP 200 e a qualidade do texto; preservar os dados e revisar eventuais custos/termos do provedor antes do uso.

## Arquitetura de referência

- Interface: Next.js, React, TypeScript — Vercel e alternativa no Render.
- API: NestJS, Node.js — Render; valida autenticação, regras e permissões.
- Identidade: Clerk; autorização: perfis `AGENT` e `SUPERVISOR` no backend.
- Persistência: PostgreSQL no Supabase por Data API/PostgREST.
- Versionamento e qualidade: GitHub, GitHub Actions, testes automatizados e smoke tests.
- Prototipação: Google Stitch. ChatGPT/Codex auxiliaram organização e revisão, mas não substituem testes.

## Recursos não entregues ou sem validação completa

- Integrações com OLT/ONU/ONT, ERP e WhatsApp; aplicativo móvel nativo; automações e alertas inteligentes: **fora do MVP**.
- Prisma e Sentry: citados em propostas anteriores, não comprovados como implementados nesta entrega.
- IA ao vivo: **uma geração real aprovada**; fluxo completo de supervisor: **aceitação publicada ainda pendente**.
- O frontend alternativo do Render pode exigir configuração do Clerk; prefira a URL Vercel para demonstrações até validação específica.

## Evidências

- Código e testes: `apps/api/src/ai/`, `apps/web/src/components/`, `apps/api/tests/`.
- Execução de CI referenciada na entrega: https://github.com/Marcusvajr/supportflow/actions/runs/38605369155.
- Consulte `docs/final-checklist.md` e `docs/presentation-v3.md` para limitações e roteiro.

## Dados de teste adicionados em 14/10/2026

No Supabase, foram inseridos diretamente e identificados como fictícios quatro clientes (`SF-TEST-101` a `SF-TEST-104`) e chamados com protocolos `SF-2026-000005` a `SF-2026-000008`. Foram adicionadas onze atividades (NOTE, TEST e DIAGNOSIS) e testadas mudanças de status e resolução. Verificação de integridade: **6 clientes, 7 chamados, 14 atividades e 31 eventos de auditoria**. Esses testes confirmam persistência e triggers, **não validam os formulários nem a autorização da API pelo navegador**.
