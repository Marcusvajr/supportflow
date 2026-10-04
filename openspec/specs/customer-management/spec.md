# Customer Management Specification

## ADDED Requirements

### Requirement: clientes fictícios persistidos

O sistema SHALL persistir clientes de demonstração em PostgreSQL e SHALL impedir o uso da interface web para acesso direto ao banco.

#### Scenario: criar cliente válido

- **GIVEN** um usuário autenticado e ativo
- **WHEN** ele envia nome e código de referência válidos
- **THEN** o backend cria o cliente
- **AND** retorna o registro persistido
- **AND** o código de referência é normalizado em maiúsculas

#### Scenario: impedir código duplicado

- **GIVEN** um cliente existente com um código de referência
- **WHEN** outro cliente é criado com o mesmo código
- **THEN** a API responde `409`
- **AND** nenhum registro duplicado é criado

### Requirement: consulta e busca

O sistema SHALL permitir listar e localizar clientes fictícios por nome ou código de referência.

#### Scenario: listar clientes

- **GIVEN** clientes persistidos
- **WHEN** o usuário consulta `GET /api/v1/customers`
- **THEN** recebe uma página com itens, página atual, tamanho e total

#### Scenario: buscar por texto

- **GIVEN** clientes persistidos
- **WHEN** o usuário informa `q`
- **THEN** a busca considera nome e código de referência

### Requirement: detalhe e atualização

O sistema SHALL permitir consultar e atualizar um cliente existente.

#### Scenario: consultar detalhe

- **WHEN** o usuário consulta um ID existente
- **THEN** a API retorna o cliente

#### Scenario: cliente inexistente

- **WHEN** o usuário consulta um ID inexistente
- **THEN** a API responde `404`

#### Scenario: atualizar cliente

- **GIVEN** um cliente existente
- **WHEN** o usuário altera campos válidos
- **THEN** os dados são persistidos
- **AND** `updatedAt` é atualizado

### Requirement: validação de entrada

O backend SHALL validar os dados antes da persistência.

#### Scenario: nome inválido

- **WHEN** o nome possui menos de 2 ou mais de 120 caracteres
- **THEN** a API responde `400`

#### Scenario: código inválido

- **WHEN** o código contém caracteres fora de letras, números, hífen e sublinhado
- **THEN** a API responde `400`

### Requirement: proteção de acesso

Todos os endpoints de clientes SHALL exigir autenticação e usuário interno ativo.

#### Scenario: visitante sem token

- **WHEN** um visitante chama `/customers`
- **THEN** a API responde `401`

#### Scenario: usuário sem acesso interno

- **WHEN** um usuário autenticado não está ativo no SupportFlow
- **THEN** a API responde `403`
