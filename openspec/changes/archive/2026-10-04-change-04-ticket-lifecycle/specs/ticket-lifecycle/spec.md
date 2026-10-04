# Ticket Lifecycle Specification

## ADDED Requirements

### Requirement: criação de chamado

O sistema SHALL permitir que usuário autenticado e ativo crie chamado para cliente existente.

#### Scenario: criação válida

- **GIVEN** cliente persistido e usuário ativo
- **WHEN** título, descrição, categoria e prioridade são válidos
- **THEN** o chamado é criado com status `OPEN`
- **AND** recebe protocolo único
- **AND** o usuário criador é associado ao chamado

### Requirement: transições de status

O backend SHALL ser a fonte única das transições permitidas.

#### Scenario: iniciar diagnóstico

- **GIVEN** chamado `OPEN`
- **WHEN** o usuário altera o status para `DIAGNOSING`
- **THEN** a alteração é persistida
- **AND** um evento de auditoria é registrado

#### Scenario: transição inválida

- **WHEN** uma transição não permitida é solicitada
- **THEN** a API responde `400`
- **AND** o estado anterior é preservado

### Requirement: resolução

O sistema SHALL exigir resolução textual antes de concluir um chamado.

#### Scenario: resolver chamado em diagnóstico

- **GIVEN** chamado `DIAGNOSING`
- **WHEN** resolução válida é informada
- **THEN** o status passa a `RESOLVED`
- **AND** `resolvedAt` é preenchido
- **AND** a resolução fica persistida

### Requirement: reabertura

Somente supervisor SHALL reabrir chamado resolvido.

#### Scenario: atendente tenta reabrir

- **GIVEN** chamado `RESOLVED`
- **WHEN** usuário `AGENT` tenta mover para `DIAGNOSING`
- **THEN** a API responde `403`

#### Scenario: supervisor reabre

- **GIVEN** chamado `RESOLVED`
- **WHEN** usuário `SUPERVISOR` move para `DIAGNOSING`
- **THEN** o chamado é reaberto
- **AND** resolução e data de resolução são limpas
- **AND** o histórico registra a reabertura
