# Ticket Activities Specification

## ADDED Requirements

### Requirement: registrar atividade técnica

O sistema SHALL permitir registrar `NOTE`, `TEST` e `DIAGNOSIS` em chamado existente.

#### Scenario: registrar teste

- **GIVEN** chamado existente
- **WHEN** atendente registra um teste
- **THEN** a atividade é persistida com autor e data/hora
- **AND** aparece na linha do tempo

#### Scenario: registrar diagnóstico

- **WHEN** atendente registra um diagnóstico
- **THEN** o texto permanece associado ao chamado
- **AND** não altera o status automaticamente

### Requirement: linha do tempo

O sistema SHALL retornar atividades técnicas e eventos de auditoria em ordem cronológica.

#### Scenario: consultar histórico

- **GIVEN** chamado com atividades e mudanças de estado
- **WHEN** o usuário abre o detalhe
- **THEN** visualiza o histórico técnico e os eventos relevantes em uma única linha do tempo

### Requirement: preservar contexto

Novas atividades SHALL ser acrescentadas sem apagar registros anteriores.

#### Scenario: múltiplos diagnósticos

- **WHEN** um novo diagnóstico é registrado
- **THEN** o diagnóstico anterior permanece no histórico
- **AND** ambos podem ser auditados posteriormente
