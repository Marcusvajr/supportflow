# Recuperação da autenticação — 14/10/2026

## Evidências e escopo

- Base publicada: `9a5c0020c8663f074d60648e8e15cf67338bf5b4`.
- Nenhuma configuração ou implantação publicada foi alterada durante este diagnóstico.
- API e frontend Render responderam HTTP 200 nos health checks.
- O frontend Render abriu a página pública, mas `/sign-in` mostrou **Autenticação indisponível**. O código renderiza esse aviso quando `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` está ausente na versão construída.
- Logs de instâncias anteriores registraram chave pública inválida. Isso não comprova o valor da configuração atual; nenhum segredo foi recuperado ou impresso.
- Preflight com origem Render recebeu `Access-Control-Allow-Origin` apontando apenas para a Vercel. O navegador bloqueia essa combinação.
- O erro anterior do dashboard da Vercel ainda não tem causa confirmada. O diagnóstico de CORS do Render não explica esse erro.

## Correção isolada

`FRONTEND_ORIGIN` passa a aceitar origens exatas separadas por vírgulas, como já ocorre no fallback de `CLERK_AUTHORIZED_PARTIES`. Uma única origem continua funcionando. Não há wildcard nem permissão implícita em produção. Valores com caminho, credenciais ou formato inválido impedem a inicialização com mensagem sem valores sensíveis.

Teste HTTP real cobre os dois frontends, preflight com Authorization e rejeição de origens externas. A suíte da API passou com 45 testes; a correção não altera papéis, banco ou verificação de tokens.

## Configuração a validar antes da publicação

Em ambiente separado, configurar:

| Serviço | Variável | Origem do valor |
| --- | --- | --- |
| Frontend | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave pública da mesma aplicação/instância Clerk usada pela API |
| Frontend | `NEXT_PUBLIC_API_URL` | URL da API de teste, incluindo `/api/v1` |
| Frontend servidor, se requerido pelo middleware | `CLERK_SECRET_KEY` | Nova chave secreta, somente no ambiente do servidor |
| API | `FRONTEND_ORIGIN` | Origem exata do frontend de teste |
| API | `CLERK_AUTHORIZED_PARTIES` | Mesma origem autorizada para o token |
| API | `CLERK_SECRET_KEY` / `CLERK_JWT_KEY` | Credencial/verificador da instância correta |
| API | `DEMO_*_CLERK_ID` | IDs das contas fictícias correspondentes aos papéis existentes |

As variáveis `NEXT_PUBLIC_*` precisam estar presentes durante o build. Alterá-las apenas no runtime não atualiza o bundle: reconstruir o frontend após corrigir a configuração.

Para manter ambos os frontends atuais após validação, o valor proposto para `FRONTEND_ORIGIN` e, quando aplicável, `CLERK_AUTHORIZED_PARTIES` é:

```text
https://supportflow-pi.vercel.app,https://supportflow-web.onrender.com
```

Essa configuração ainda NÃO foi aplicada. Não usar o banco publicado para os testes de escrita em staging.

## Rotação e aceite pendentes

1. Na instância Clerk correta, criar uma nova Secret Key mantendo temporariamente a antiga.
2. Configurar a nova chave diretamente nos ambientes consumidores, sem chat, repositório ou logs.
3. Validar em ambiente isolado: login, `/me`, dashboard, clientes, chamado, atividade, resolução e logout; conferir 401/403 e papéis.
4. Publicar somente após os testes e confirmar uso da nova chave. Revogar então a chave exposta; não restaurá-la em rollback.

A troca de credencial pelo navegador exige ação do titular. Esta branch não afirma que a rotação ou o teste autenticado publicado foram concluídos.

O audit anterior encontrou cinco alertas em dependências (dois altos e três críticos). Eles continuam pendentes e podem impedir o CI; esta alteração não modifica dependências.

Referências: [CORS no NestJS](https://docs.nestjs.com/security/cors), [variáveis públicas no Next.js](https://nextjs.org/docs/pages/guides/environment-variables), [rotação no Clerk](https://clerk.com/docs/guides/secure/rotate-api-keys).
