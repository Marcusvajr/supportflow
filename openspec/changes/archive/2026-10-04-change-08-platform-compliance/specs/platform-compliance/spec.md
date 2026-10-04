# Platform Compliance Specification

## ADDED Requirements

### Requirement: correlação

Toda resposta SHALL possuir identificador de requisição.

#### Scenario: requisição normal

- **WHEN** uma requisição chega à API
- **THEN** a resposta inclui `X-Request-Id`
- **AND** inclui `traceparent`
- **AND** o log estruturado utiliza o mesmo identificador

### Requirement: privacidade de logs

Logs de acesso SHALL excluir credenciais e query string.

#### Scenario: token enviado incorretamente na URL

- **WHEN** a rota falha
- **THEN** o log não contém o valor do token
- **AND** o Problem Details usa somente o pathname no campo `instance`

### Requirement: containers OCI

O frontend e backend SHALL possuir definições de imagem versionadas e reproduzíveis.

### Requirement: IaC

A infraestrutura necessária à aplicação SHALL ter artefatos declarativos versionados e sem segredos fixos.

### Requirement: health check

A API SHALL expor endpoint público de saúde utilizável por plataforma e container.
