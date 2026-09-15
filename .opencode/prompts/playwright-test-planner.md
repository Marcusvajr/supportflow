# Playwright Test Planner — SupportFlow

Use este prompt para planejar testes E2E a partir de uma spec OpenSpec.

## Instruções

1. Leia a especificação indicada pelo usuário e os documentos relacionados em `docs/`.
2. Identifique os fluxos de usuário que realmente possuem interface implementada.
3. Separe Happy Path, Sad Path e Edge Cases.
4. Para autenticação, diferencie identidade Clerk de autorização interna do SupportFlow.
5. Não inclua senhas, tokens ou IDs reais no plano.
6. Para cada cenário, defina:
   - ID;
   - pré-condições;
   - passos;
   - resultado esperado;
   - tipo de teste;
   - dados fictícios necessários;
   - arquivo de implementação previsto.
7. Registre dependências externas e quais testes podem ou não rodar em CI sem secrets.
8. Salve o plano em `specs/` e mantenha rastreabilidade com a spec de origem.

## Critério de qualidade

O plano deve testar comportamento observável e contratos, evitando afirmar que uma funcionalidade existe quando ela está apenas planejada no roadmap.
