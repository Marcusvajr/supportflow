# Especificação Técnica do Produto

> O repositório de referência utilizado no roteiro da disciplina não disponibilizava `template.spec.md` no momento da elaboração. Este documento foi estruturado para cumprir a função descrita no roteiro: transformar o PRD em regras de negócio, fluxos, estados, validações e contratos implementáveis.

## 1. Visão Geral

O SupportFlow é uma aplicação web para gerenciamento e continuidade de chamados técnicos em provedores de internet.

A especificação descreve o comportamento esperado do MVP sem definir detalhes internos que pertencem exclusivamente à arquitetura.

## 2. Atores

### 2.1 Atendente

Pode:

- consultar dashboard;
- consultar clientes;
- criar chamado;
- visualizar chamados;
- registrar atividades técnicas;
- registrar diagnóstico;
- alterar status;
- alterar prioridade;
- assumir ou atribuir chamado conforme permissão;
- resolver chamado.

### 2.2 Supervisor

Possui todas as permissões do atendente e adicionalmente pode:

- visualizar chamados de toda a equipe;
- alterar responsável;
- acompanhar chamados críticos;
- administrar usuários/perfis em evolução futura.

## 3. Entidades de Negócio

### 3.1 User

Campos mínimos:

- id
- externalAuthId
- name
- email
- role
- active
- createdAt
- updatedAt

Papéis:

- AGENT
- SUPERVISOR

### 3.2 Customer

Campos mínimos:

- id
- name
- referenceCode
- documentMasked
- phoneMasked
- city
- active
- createdAt
- updatedAt

Observação: ambiente acadêmico deve utilizar dados fictícios.

### 3.3 Ticket

Campos mínimos:

- id
- protocol
- customerId
- title
- description
- category
- status
- priority
- assignedToUserId
- createdByUserId
- resolution
- createdAt
- updatedAt
- resolvedAt

Categorias iniciais:

- NO_CONNECTION
- SLOW_CONNECTION
- INTERMITTENCE
- WIFI
- EQUIPMENT
- ACCESS_TO_SERVICE
- OTHER

Status:

- OPEN
- DIAGNOSING
- ESCALATED
- RESOLVED

Prioridade:

- LOW
- MEDIUM
- HIGH
- CRITICAL

### 3.4 TicketActivity

Campos mínimos:

- id
- ticketId
- authorUserId
- type
- description
- createdAt

Tipos:

- NOTE
- TEST
- DIAGNOSIS
- STATUS_CHANGE
- PRIORITY_CHANGE
- ASSIGNMENT
- RESOLUTION

### 3.5 AuditEvent

Campos mínimos:

- id
- entityType
- entityId
- action
- actorUserId
- metadata
- createdAt

## 4. Regras de Negócio

### RN-01 Criação de chamado

Um chamado só pode ser criado quando:

- houver cliente válido;
- título estiver preenchido;
- descrição estiver preenchida;
- categoria for válida;
- prioridade for válida;
- usuário criador estiver autenticado.

Estado inicial padrão: `OPEN`.

### RN-02 Protocolo

Cada chamado deverá possuir protocolo único, gerado pelo backend.

Formato sugerido:

`SF-YYYY-NNNNNN`

Exemplo:

`SF-2026-000123`

### RN-03 Responsável

Um chamado pode possuir um responsável.

No MVP:

- o criador poderá assumir o chamado;
- supervisores poderão reatribuir o responsável;
- toda troca deverá gerar evento no histórico.

### RN-04 Mudança de status

Transições permitidas:

```text
OPEN -> DIAGNOSING
OPEN -> ESCALATED
DIAGNOSING -> ESCALATED
DIAGNOSING -> RESOLVED
ESCALATED -> DIAGNOSING
ESCALATED -> RESOLVED
RESOLVED -> DIAGNOSING (somente supervisor, reabertura)
```

Toda alteração deve registrar:

- status anterior;
- novo status;
- usuário;
- data/hora.

### RN-05 Resolução

Para alterar um chamado para `RESOLVED`:

- o campo `resolution` é obrigatório;
- `resolvedAt` deve ser preenchido;
- deverá existir evento `RESOLUTION`.

### RN-06 Diagnóstico

O diagnóstico será registrado como atividade do tipo `DIAGNOSIS`.

Podem existir diagnósticos sucessivos. O diagnóstico mais recente será destacado na tela do chamado.

### RN-07 Testes realizados

Cada procedimento relevante poderá ser registrado como `TEST`.

Exemplos:

- reinício de equipamento;
- teste via cabo;
- teste em outra rede Wi-Fi;
- validação de sinal;
- verificação de logs;
- teste de conectividade.

O sistema não deve interpretar automaticamente o resultado no MVP.

### RN-08 Histórico

Eventos que obrigatoriamente aparecem na linha do tempo:

- criação;
- mudança de status;
- mudança de prioridade;
- mudança de responsável;
- atividade técnica;
- diagnóstico;
- resolução;
- reabertura.

### RN-09 Prioridade

Prioridades válidas:

- LOW
- MEDIUM
- HIGH
- CRITICAL

Toda alteração gera histórico.

### RN-10 Exclusão

Chamados não serão excluídos fisicamente no MVP.

Caso seja necessária remoção no futuro, deverá ser adotado soft delete com auditoria.

## 5. Casos de Uso

### UC-01 Realizar login

**Pré-condição:** usuário cadastrado e ativo.

**Fluxo principal:**

1. Usuário acessa a aplicação.
2. Aplicação redireciona ao fluxo do Clerk.
3. Usuário informa credenciais.
4. Clerk autentica.
5. Frontend recebe sessão.
6. Backend valida token.
7. Dashboard é exibido.

**Fluxo de exceção:**

- credenciais inválidas: negar acesso;
- usuário inativo na aplicação: retornar acesso negado.

### UC-02 Criar chamado

**Pré-condição:** usuário autenticado.

**Fluxo principal:**

1. Usuário seleciona "Novo chamado".
2. Seleciona cliente.
3. Informa título, descrição, categoria e prioridade.
4. Define responsável ou assume o chamado.
5. Confirma.
6. Backend valida dados.
7. Backend gera protocolo.
8. Ticket é persistido.
9. Evento de criação é registrado.
10. Sistema abre a tela de detalhes.

### UC-03 Registrar teste

1. Usuário abre chamado.
2. Seleciona "Registrar atividade".
3. Escolhe tipo "Teste".
4. Descreve procedimento e resultado.
5. Confirma.
6. Atividade é adicionada à linha do tempo.

### UC-04 Registrar diagnóstico

1. Usuário abre chamado.
2. Seleciona "Registrar diagnóstico".
3. Informa a hipótese/conclusão.
4. Confirma.
5. Diagnóstico aparece na linha do tempo e no resumo.

### UC-05 Encaminhar chamado

1. Usuário abre chamado.
2. Altera status para `ESCALATED`.
3. Seleciona responsável quando aplicável.
4. Registra observação de encaminhamento.
5. Backend atualiza ticket.
6. Eventos são registrados.

### UC-06 Resolver chamado

1. Usuário abre chamado.
2. Seleciona "Resolver".
3. Informa resolução.
4. Confirma.
5. Backend valida.
6. Status passa para `RESOLVED`.
7. `resolvedAt` é preenchido.
8. Evento de resolução é criado.

## 6. Requisitos de Interface

### 6.1 Login

Elementos:

- identidade visual SupportFlow;
- ação de autenticação;
- mensagens de erro do provedor de identidade.

### 6.2 Dashboard

Deve exibir:

- total de chamados abertos;
- em diagnóstico;
- encaminhados;
- críticos;
- resolvidos;
- lista de chamados recentes;
- atalhos para novo chamado e lista completa.

### 6.3 Lista de Chamados

Colunas mínimas:

- protocolo;
- cliente;
- título;
- categoria;
- prioridade;
- status;
- responsável;
- atualização.

Filtros:

- texto;
- status;
- prioridade;
- categoria;
- responsável.

### 6.4 Detalhes do Chamado

Blocos:

- cabeçalho com protocolo/status/prioridade;
- dados do cliente;
- descrição;
- diagnóstico atual;
- responsável;
- ações;
- linha do tempo.

### 6.5 Novo Chamado

Campos:

- cliente;
- título;
- descrição;
- categoria;
- prioridade;
- responsável.

## 7. Validações

### Customer

- name: obrigatório, 2 a 120 caracteres.
- referenceCode: obrigatório e único.
- documentMasked: opcional.
- phoneMasked: opcional.
- city: opcional.

### Ticket

- title: obrigatório, 5 a 150 caracteres.
- description: obrigatório, 10 a 5000 caracteres.
- category: enum válido.
- priority: enum válido.
- customerId: deve existir.
- assignedToUserId: deve apontar para usuário ativo quando informado.

### TicketActivity

- description: obrigatório, 2 a 5000 caracteres.
- type: enum válido.

### Resolution

- obrigatório para status `RESOLVED`;
- 10 a 5000 caracteres.

## 8. API do MVP

Base sugerida:

`/api/v1`

### Auth / Current User

- `GET /me`

### Customers

- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PATCH /customers/:id`

### Tickets

- `GET /tickets`
- `POST /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `PATCH /tickets/:id/status`
- `PATCH /tickets/:id/priority`
- `PATCH /tickets/:id/assignee`
- `POST /tickets/:id/resolve`

### Activities

- `GET /tickets/:id/activities`
- `POST /tickets/:id/activities`

### Dashboard

- `GET /dashboard/summary`

## 9. Paginação, Busca e Ordenação

Parâmetros sugeridos:

- `page`
- `pageSize`
- `q`
- `status`
- `priority`
- `category`
- `assigneeId`
- `sort`
- `order`

Padrões:

- page = 1
- pageSize = 20
- máximo pageSize = 100

## 10. Erros

A API deverá usar respostas consistentes.

Exemplo:

```json
{
  "type": "validation_error",
  "title": "Dados inválidos",
  "status": 400,
  "detail": "O campo título é obrigatório",
  "instance": "/api/v1/tickets"
}
```

Principais códigos:

- 400: validação;
- 401: não autenticado;
- 403: sem permissão;
- 404: recurso não encontrado;
- 409: conflito;
- 500: erro interno.

## 11. Critérios de Aceitação por Fluxo

### Criação de chamado

- não permite salvar sem campos obrigatórios;
- gera protocolo único;
- persiste chamado;
- registra criação no histórico;
- aparece imediatamente na listagem.

### Mudança de status

- só aceita transições permitidas;
- registra evento;
- atualiza data de modificação.

### Resolução

- exige texto de resolução;
- preenche data de resolução;
- registra evento;
- remove chamado da lista de ativos quando filtro excluir resolvidos.

### Busca

- pesquisa por protocolo, cliente e título;
- filtros podem ser combinados;
- filtros preservam paginação coerente.

## 12. Fora do MVP

- anexos binários;
- chat;
- integração com equipamentos;
- integração com ERP/CRM;
- automações;
- notificações push;
- app mobile;
- IA de diagnóstico.
