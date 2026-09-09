# Change 07 — AI Ticket Summary

## Objetivo

Incorporar um recurso de inteligência artificial assistiva para resumir o contexto técnico de chamados longos, reduzindo o tempo necessário para compreender atendimentos transferidos ou escalonados.

## Escopo funcional

- endpoint protegido para solicitar resumo do chamado;
- composição do contexto somente com dados já registrados no ticket e atividades;
- chamada a provedor de IA configurado por variável de ambiente;
- retorno de resumo contendo fatos registrados, últimos testes, diagnóstico mais recente e pendências;
- indicação explícita de que a saída é assistiva e deve ser revisada pelo atendente;
- nenhuma alteração automática de status, prioridade, diagnóstico ou responsável.

## Dependências

- `change-05-ticket-activities`.

## Riscos

- **Alucinação/omissão no resumo — Médio.** Mitigação: prompt restritivo, referência aos registros existentes e aviso de revisão humana.
- **Vazamento de dados — Médio.** Mitigação: somente dados fictícios no ambiente acadêmico, minimização do payload e segredos fora do repositório.
- **Indisponibilidade/custo do provedor — Médio.** Mitigação: falha graciosa e uso opcional do recurso.

## Lint

Obrigatório.

## Testes unitários

- montagem do contexto;
- tratamento de resposta vazia/erro do provedor;
- garantia de que a função não altera regras de negócio.

## Testes de integração

- endpoint autenticado;
- mock do provedor de IA;
- erro externo retorna resposta controlada.

## Testes E2E/aceite

- chamado com histórico extenso exibe resumo sob demanda;
- resumo não altera nenhum campo persistente sem ação humana;
- indisponibilidade da IA não impede o atendimento normal.

## Critérios de aceite

- IA é assistiva, não autônoma;
- saída baseada somente no contexto enviado;
- recurso pode ser desativado por configuração;
- nenhuma credencial de provedor aparece no frontend ou no GitHub.
