# Relatório final de testes — SupportFlow V3

## Escopo

Este relatório consolida a bateria automatizada executada no commit final da V3 pelo GitHub Actions, além das validações de publicação e banco.

## Resultado geral

**APROVADO.**

O pipeline final concluiu com sucesso todas as etapas automatizadas previstas.

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
- Playwright smoke: aprovado;
- empacotamento do ZIP final: aprovado.

## Publicação

- Vercel: deploy do frontend com status de sucesso;
- Render: API em estado `live`;
- Supabase: migrations aplicadas, RLS habilitado e Database Advisor sem alertas de segurança.

## Testes com dependências externas

Os testes autenticados reais do Clerk foram executados anteriormente com **8 cenários aprovados**. Eles não rodam no CI padrão porque exigem credenciais externas reais.

A Change 07 possui teste automatizado com provider fake para garantir isolamento, falha segura e ausência de mutação do chamado. A demonstração de uma resposta real da IA depende de uma credencial externa `AI_API_KEY` ou `OPENROUTER_API_KEY`, mantida fora do repositório.

## Pendências não técnicas

Não bloqueiam o build nem os fluxos já implementados:

- liberar ao professor permissão de execução do pipeline, conforme exigência acadêmica;
- anexar o ZIP final no Canvas;
- informar URL e credenciais demo no Canvas;
- opcionalmente cadastrar uma credencial real de IA para demonstração ao vivo.
