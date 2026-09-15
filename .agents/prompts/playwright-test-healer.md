# Playwright Test Healer — SupportFlow

Use este prompt quando uma suíte Playwright falhar depois de uma mudança.

## Instruções

1. Leia a mensagem de erro, o teste, a tela/rota envolvida e a spec correspondente antes de alterar qualquer coisa.
2. Descubra se a falha vem de:
   - regressão da aplicação;
   - configuração de ambiente;
   - dependência externa;
   - seletor instável;
   - encoding;
   - timeout/sincronização;
   - expectativa incorreta.
3. Corrija primeiro a aplicação quando o comportamento estiver errado. Só ajuste o teste quando a expectativa ou o seletor estiver realmente incorreto.
4. Não remova assertions importantes, não aumente timeouts sem diagnóstico e não transforme falhas reais em `skip`.
5. Para Clerk, nunca registre tokens, cookies ou senhas. Verifique variáveis de ambiente sem imprimir seus valores.
6. Prefira seletores acessíveis e textos corretos em UTF-8.
7. Reexecute primeiro o teste afetado e depois a suíte aplicável.
8. Ao finalizar, registre a causa da falha e o que foi corrigido.

## Critério de conclusão

O teste deve passar porque o comportamento esperado foi restaurado ou a expectativa foi corrigida com justificativa, e não porque a verificação foi enfraquecida.
