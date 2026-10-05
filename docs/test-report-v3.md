# Relatório de testes — SupportFlow V3 (04/10/2026)

> Evidência histórica do commit citado abaixo. Para o estado posterior, os testes manuais publicados de 05/10 e as pendências externas, consulte [code-review-2026-10-05.md](code-review-2026-10-05.md). A aprovação do pipeline não significa aprovação da IA ao vivo nem do fluxo de supervisor publicado.

## Escopo

Este relatório consolida a bateria automatizada executada no commit final da V3 pelo GitHub Actions, além das validações de publicação e banco.

## Resultado geral

**APROVADO.**

O pipeline final de fechamento (GitHub Actions run #124, commit `a6f10c02ca763d19ba3a69ac71ede1de5b8ba4de`) concluiu com sucesso todas as etapas automatizadas previstas. Em 04/10/2026, foi feita uma nova verificação antes da entrega: Render permaneceu `live`, as quatro migrations do Supabase estavam aplicadas e o Database Advisor continuava com **0 alertas de segurança**.

## Testes de código

### Frontend

- **4 testes aprovados**
- **0 falhas**

Cobertura funcional exercitada:
- obtenção de token por chamada;
- envio de Bearer token sem cache/cookies;
- tratamento de 401 e 403;
- bloqueio de URL externa e falha de rede.

### Backend

- **34 testes aprovados**
- **0 falhas**

Cobertura funcional exercitada:
- autenticação e assinatura Clerk;
- expiração, origem e sessões inválidas;
- RBAC AGENT/SUPERVISOR;
- usuário ativo, inativo e desconhecido;
- Problem Details e correlação;
- clientes: criação, listagem, atualização, busca e validação;
- chamados: criação, transições, prioridade e resolução;
- atividades técnicas e linha do tempo;
- escalonamento e reatribuição por supervisor;
- observabilidade e ausência de dados sensíveis em logs;
- resumo assistivo por IA sem mutação do chamado.

### Total

- **38 testes automatizados de unidade/HTTP aprovados**
- **0 falhas**
- **0 ignorados**

## Verificações adicionais do pipeline

- auditoria de dependências de produção: aprovada;
- lint/TypeScript frontend: aprovado;
- lint/TypeScript backend: aprovado;
- build Next.js: aprovado;
- build NestJS: aprovado;
- imagem OCI da API: build aprovado;
- imagem OCI do frontend: build aprovado;
- Playwright smoke: **4 cenários aprovados**;
- empacotamento do ZIP final: aprovado.

## Publicação

- Vercel: deploy do frontend com status de sucesso;
- Render: API em estado `live`;
- Supabase: 4 migrations aplicadas, RLS habilitado e Database Advisor sem alertas de segurança. O Advisor de performance apresentou apenas 2 avisos informativos de índices ainda não utilizados, compatíveis com o baixo volume do banco de demonstração.

## Testes com dependências externas

Os testes autenticados reais do Clerk foram executados anteriormente com **8 cenários aprovados**. Eles não rodam no CI padrão porque exigem credenciais externas reais.

A Change 07 possui teste automatizado com provider fake para garantir isolamento, falha segura e ausência de mutação do chamado. A integração com provedor OpenAI-compatible está pronta; uma credencial real `AI_API_KEY` ou `OPENROUTER_API_KEY` é configuração externa opcional e permanece fora do repositório.

## Pendências não técnicas

Não bloqueiam o build nem os fluxos já implementados:

- liberar ao professor permissão de execução do pipeline, conforme exigência acadêmica;
- anexar o ZIP final no Canvas;
- informar URL e credenciais demo no Canvas;
- opcionalmente cadastrar uma credencial real de IA para demonstração ao vivo.


## Revalidação final solicitada antes da entrega

Após o fechamento das changes, a base foi novamente conferida contra o commit final da V3.

- GitHub Actions run #124: **sucesso** em todas as etapas;
- audit de dependências: **sucesso**;
- lint/TypeScript: **sucesso**;
- 38 testes unitários/HTTP: **sucesso**;
- build web e API: **sucesso**;
- build dos 2 containers OCI: **sucesso**;
- Playwright smoke: **sucesso**;
- pacote final: **gerado e anexado como artefato do CI**;
- Render: **live**;
- Supabase: **0 alertas de segurança**;
- RLS: habilitado nas quatro tabelas públicas.

Essa revalidação não substitui a demonstração manual com a conta acadêmica, mas confirma que o estado versionado e implantado está consistente para entrega.
