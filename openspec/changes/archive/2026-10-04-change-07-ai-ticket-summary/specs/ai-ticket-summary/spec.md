# AI Ticket Summary Specification

## ADDED Requirements

### Requirement: resumo sob demanda

O sistema SHALL gerar resumo somente quando um usuário autenticado solicitar.

#### Scenario: provedor configurado

- **GIVEN** chamado existente com histórico
- **WHEN** o usuário solicita resumo
- **THEN** somente fatos registrados são enviados ao provedor
- **AND** a resposta retorna texto, provedor, data e aviso de revisão humana

### Requirement: nenhuma decisão autônoma

O recurso SHALL ser somente assistivo.

#### Scenario: resumo gerado

- **WHEN** o provedor retorna um resumo
- **THEN** nenhum campo persistido do chamado é modificado

### Requirement: falha graciosa

#### Scenario: credencial ausente ou provedor indisponível

- **WHEN** a IA não pode responder
- **THEN** a API retorna `503`
- **AND** criação, diagnóstico, resolução e histórico continuam disponíveis

### Requirement: segredos apenas no backend

- **THEN** chaves do provedor não aparecem em bundles do frontend, respostas da API ou repositório.
