# Mapeamento de Histórias — SupportFlow

## Backbone da jornada

| Atividade | Histórias principais |
|---|---|
| Acessar | autenticar, encerrar sessão, validar perfil ativo |
| Localizar cliente | buscar, listar, consultar detalhe |
| Registrar cliente | cadastrar cliente fictício, corrigir dados básicos |
| Abrir chamado | selecionar cliente, informar problema, prioridade e responsável, gerar protocolo |
| Diagnosticar | registrar teste, observação e diagnóstico |
| Encaminhar | alterar status, reatribuir responsável, preservar contexto |
| Resolver | registrar solução, concluir chamado, consultar histórico |
| Acompanhar | buscar, filtrar, visualizar dashboard |
| Resumir | solicitar resumo assistivo do histórico |

## Release 1 — Fundação e identidade

Entregue nas Changes 01 e 02.

- estrutura do monorepo;
- frontend e backend;
- health checks;
- autenticação Clerk;
- autorização por perfil;
- usuário ativo/inativo;
- testes e CI inicial.

## Release 2 — V3: primeiro fluxo de negócio completo

Objetivo: permitir que um atendente execute o ciclo de atendimento com persistência.

- cadastrar e consultar cliente fictício;
- criar chamado;
- gerar protocolo;
- definir prioridade e responsável;
- registrar teste;
- registrar diagnóstico;
- alterar status;
- resolver chamado;
- consultar linha do tempo.

Changes: 03, 04 e 05.

## Release 3 — Operação e segundo fluxo

Objetivo: permitir continuidade e supervisão de um chamado escalonado.

- busca e filtros;
- dashboard;
- escalonamento;
- reatribuição por supervisor;
- continuidade por outro responsável;
- reabertura por supervisor.

Change principal: 06, complementando 05.

## Release 4 — Fechamento técnico da disciplina

- resumo assistivo por IA;
- observabilidade final;
- containers OCI;
- Infraestrutura como Código;
- validação dos dois fluxos ponta a ponta;
- revisão de segurança, acessibilidade e documentação.

Changes: 07 e 08.

## Critério de corte

Cadastros isolados não são considerados fluxo de negócio completo. A V3 somente atinge seu objetivo quando o cliente criado consegue participar de um chamado que evolui até resolução com histórico persistido.
