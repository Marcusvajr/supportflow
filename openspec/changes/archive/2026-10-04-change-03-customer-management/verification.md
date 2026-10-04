# Verification — Change 03 Customer Management

## Resultado

**Aprovada em código, infraestrutura e publicação.**

## Evidências

- migrations de clientes aplicadas no Supabase;
- tabela `public.customers` com RLS habilitado;
- seed somente com clientes fictícios;
- API REST de listagem, detalhe, criação e atualização protegida pela autenticação global;
- interface de clientes publicada;
- testes unitários e HTTP/integrados verdes no CI;
- integração Render → Supabase configurada por variáveis de ambiente;
- acesso autenticado à aplicação publicada validado durante a V3.

O CI não armazena credenciais Clerk reais. A autenticação real foi validada manualmente e as regras de domínio permanecem cobertas por testes automatizados.
