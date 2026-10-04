# Tasks — Change 03 Customer Management

## Persistência

- [x] definir tabela `customers`;
- [x] criar migration SQL;
- [x] criar seed exclusivamente fictício;
- [x] definir variáveis de ambiente do Supabase;
- [x] implementar repositório abstrato;
- [x] implementar repositório Supabase/PostgREST;
- [x] aplicar migration no projeto Supabase;
- [x] configurar credenciais do banco no Render.

## Backend

- [x] criar modelo e contratos de cliente;
- [x] implementar serviço com validações;
- [x] implementar endpoints de listagem, detalhe, criação e atualização;
- [x] mapear conflito de código para `409`;
- [x] retornar `503` quando persistência não estiver configurada;
- [x] adicionar testes unitários;
- [x] adicionar testes HTTP/integrados.

## Frontend

- [x] criar rota `/customers`;
- [x] criar formulário de cliente fictício;
- [x] adicionar busca por nome/código;
- [x] criar rota de detalhe;
- [x] permitir atualização;
- [x] adicionar acesso a clientes pelo dashboard;
- [ ] validar fluxo completo no ambiente publicado.

## Qualidade

- [x] CI verde após a implementação;
- [ ] validar aplicação publicada;
- [ ] executar aceite com conta demo;
- [ ] registrar evidências em `verification.md`;
- [ ] arquivar a change após conclusão.
