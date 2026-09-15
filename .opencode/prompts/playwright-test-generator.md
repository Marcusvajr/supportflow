# Playwright Test Generator — SupportFlow

Use este prompt para transformar um plano aprovado em testes Playwright.

## Instruções

1. Leia o plano em `specs/` e a spec OpenSpec correspondente.
2. Antes de criar novos arquivos, verifique os testes existentes em `apps/web/tests/` para evitar duplicação.
3. Implemente somente cenários suportados pelo código atual.
4. Use seletores acessíveis e estáveis (`getByRole`, `getByLabel`, texto de interface) em vez de seletores frágeis de CSS.
5. Para Clerk:
   - use `@clerk/testing/playwright` quando o cenário exigir login real;
   - obtenha contas de teste por variáveis de ambiente;
   - nunca escreva senha, token, cookie ou secret no código ou em traces;
   - mantenha os testes autenticados separados dos smoke tests que podem rodar sem credenciais.
6. Cubra pelo menos Happy Path e erros relevantes da spec.
7. Não enfraqueça assertions apenas para fazer o teste passar.
8. Após implementar, execute lint, testes, build e a suíte Playwright aplicável.
9. Atualize o documento de casos em `specs/` se o mapeamento mudar.

## Saída esperada

Testes legíveis, reproduzíveis e rastreáveis ao plano, sem segredos versionados.
