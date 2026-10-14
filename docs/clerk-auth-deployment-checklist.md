# Clerk — validação de configuração e retorno seguro do login

## O que esta branch faz

- Verifica o formato da Publishable Key e a compatibilidade test/live com a Secret Key **antes do build** do Next.js.
- Rejeita a cópia de um bloco inteiro de `.env`, valores concatenados e credenciais incompletas.
- Emite erros sem revelar os valores das chaves.
- Mantém a aplicação pública sem autenticação disponível quando **ambas** as chaves estão ausentes; rotas privadas continuam sem acesso.
- **Não** cria usuários, não faz login automaticamente, não altera a API nem o banco e não modifica serviços publicados.

## Ambiente de teste — não usar produção

1. Escolher uma instância Clerk específica; não misturar chaves de aplicações diferentes.
2. Gerar uma **nova** Secret Key no Clerk, pois uma credencial anterior foi exposta.
3. Configurar **no ambiente de teste**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: apenas a chave `pk_test_...` completa, sem nome nem `=`.
   - `CLERK_SECRET_KEY`: apenas a nova `sk_test_...` completa, exclusivamente no servidor.
   - `NEXT_PUBLIC_API_URL`: URL da API de teste terminada em `/api/v1`.
4. Configurar o backend de teste com verificador JWT da **mesma instância Clerk**, CORS adequado e IDs de demonstração. Usar banco de teste para escritas.
5. Recompilar o frontend para incorporar variáveis `NEXT_PUBLIC_*`; reiniciar o servidor não é suficiente.
6. Testar formulário de login, sessão, `/me`, painel, cliente, chamado, atividade e logout; conferir papéis AGENT/SUPERVISOR e negativas 401/403.
7. Só após passar os testes, planejar atualização gradual em produção com possibilidade de reversão. Revogar a chave antiga assim que os consumidores migrarem.

## Critérios para publicar

- CI com testes, lint e build aprovados (vulnerabilidades de dependências devem ser tratadas).
- Sem erros de Clerk nos logs.
- Login e fluxo de chamados demonstrados em ambiente isolado.
- Chave exposta substituída e plano de revogação concluído.

Até lá, **não fazer merge automático** desta branch ou da PR de CORS e não repetir deploys manuais em produção.
