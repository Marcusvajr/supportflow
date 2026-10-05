# Dashboard and Search Specification

## ADDED Requirements

### Requirement: resumo operacional

O sistema SHALL disponibilizar um resumo da fila baseado na persistência.

#### Scenario: dashboard com chamados

- **GIVEN** chamados em estados diferentes
- **WHEN** o usuário consulta o resumo
- **THEN** recebe totais por estado
- **AND** total de críticos ativos
- **AND** os chamados mais recentes

#### Scenario: volume acima do limite do Data API

- **GIVEN** mais de 1.000 chamados persistidos
- **WHEN** o usuário consulta o resumo
- **THEN** os totais abrangem toda a base usando contagem exata no servidor
- **AND** prioridades críticas e altas excluem chamados resolvidos
- **AND** falhas de contagem retornam indisponibilidade, sem apresentar totais parciais

### Requirement: busca textual

O sistema SHALL localizar chamados por protocolo, título ou cliente.

#### Scenario: busca por cliente

- **GIVEN** chamado vinculado a um cliente
- **WHEN** o usuário busca parte do nome ou referência do cliente
- **THEN** o chamado correspondente aparece na página de resultados

### Requirement: filtros combinados

O sistema SHALL aceitar filtros de status, prioridade, categoria e responsável na mesma consulta.

#### Scenario: filtros válidos

- **WHEN** múltiplos filtros são enviados
- **THEN** somente chamados compatíveis são retornados
- **AND** a paginação permanece consistente

### Requirement: paginação

O pageSize SHALL ter padrão 20 e máximo 100.

#### Scenario: paginação inválida

- **WHEN** page ou pageSize possuem valor inválido
- **THEN** a API responde `400`.
