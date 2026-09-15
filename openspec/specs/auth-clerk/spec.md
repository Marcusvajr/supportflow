# auth-clerk Specification

## Purpose
Permitir que atendentes e supervisores acessem o SupportFlow com autenticação delegada ao Clerk, garantindo que toda requisição à API protegida seja validada no backend e que a autorização por papel (`AGENT`, `SUPERVISOR`) seja aplicada exclusivamente no NestJS.

## Requirements

### Requirement: Login e sessão no frontend

O frontend MUST iniciar o fluxo de autenticação pelo Clerk, manter a sessão do usuário e redirecionar ao dashboard após login bem-sucedido.

#### Scenario: Login válido

- **WHEN** um usuário com credenciais válidas conclui o fluxo de login do Clerk
- **THEN** o frontend recebe a sessão e redireciona ao dashboard
- **AND** a identidade visual do SupportFlow está presente na experiência de autenticação

#### Scenario: Credenciais inválidas

- **WHEN** o usuário informa credenciais inválidas no fluxo do Clerk
- **THEN** o acesso é negado e a mensagem de erro do provedor de identidade é exibida

### Requirement: Proteção de rotas privadas no frontend

O frontend MUST impedir o acesso a rotas privadas sem sessão ativa, redirecionando ao login.

#### Scenario: Acesso sem sessão

- **WHEN** um visitante sem sessão acessa uma rota privada do frontend
- **THEN** é redirecionado à tela de login
- **AND** após autenticação retorna ao destino original ou ao dashboard

#### Scenario: Sessão expirada

- **WHEN** a sessão expira durante o uso do frontend
- **THEN** o usuário é redirecionado ao login na próxima interação que exige sessão

### Requirement: Envio de token à API

O frontend MUST enviar o token de sessão do Clerk no cabeçalho `Authorization: Bearer` em toda requisição a endpoints protegidos da API.

#### Scenario: Requisição autenticada

- **WHEN** o frontend chama um endpoint protegido com sessão ativa
- **THEN** a requisição contém o cabeçalho `Authorization` com token válido
- **AND** nenhum segredo do Clerk está presente no frontend

#### Scenario: Requisição sem token

- **WHEN** uma requisição chega a um endpoint protegido sem cabeçalho `Authorization`
- **THEN** a API responde `401` no formato Problem Details

### Requirement: Validação de token no backend

O backend MUST validar o token do Clerk em toda rota protegida e MUST rejeitar requisições com token ausente, inválido ou expirado.

#### Scenario: Token válido

- **WHEN** uma requisição autenticada chega a uma rota protegida
- **THEN** o backend valida o token e permite o prosseguimento

#### Scenario: Token inválido ou expirado

- **WHEN** uma requisição chega com token inválido ou expirado
- **THEN** a API responde `401` no formato Problem Details
- **AND** nenhum dado de negócio é retornado

### Requirement: Resolução de usuário interno

O backend MUST resolver a identidade externa autenticada para um usuário interno do sistema e MUST recusar o acesso quando o usuário não existir ou estiver inativo.

#### Scenario: Usuário interno ativo

- **WHEN** o token corresponde a um usuário interno com `active = true`
- **THEN** a requisição prossegue com o contexto do usuário resolvido, incluindo o papel

#### Scenario: Usuário interno inexistente

- **WHEN** o token é válido mas não corresponde a nenhum usuário interno
- **THEN** a API responde `403` no formato Problem Details

#### Scenario: Usuário interno inativo

- **WHEN** o token corresponde a um usuário interno com `active = false`
- **THEN** a API responde `403` no formato Problem Details
- **AND** o frontend exibe a tela de acesso indisponível quando o usuário consulta o próprio acesso

### Requirement: Identidade do usuário atual

A API MUST expor `GET /api/v1/me` retornando os dados do usuário autenticado.

#### Scenario: Consulta do próprio perfil

- **WHEN** um usuário autenticado e ativo consulta `GET /api/v1/me`
- **THEN** a API responde `200` com id, nome, e-mail e papel do usuário

#### Scenario: Consulta sem autenticação

- **WHEN** `GET /api/v1/me` é chamado sem token válido
- **THEN** a API responde `401` no formato Problem Details

### Requirement: Autorização RBAC no backend

O backend MUST aplicar controle de acesso por papéis `AGENT` e `SUPERVISOR` em guards/policies no NestJS, onde `SUPERVISOR` possui todas as permissões de `AGENT`.

#### Scenario: Acesso com papel permitido

- **WHEN** uma requisição de um usuário `AGENT` chega a um endpoint que exige `AGENT`
- **THEN** o backend permite o acesso

#### Scenario: Acesso negado por papel

- **WHEN** uma requisição de usuário sem o papel exigido chega a um endpoint protegido por papel
- **THEN** a API responde `403` no formato Problem Details
- **AND** nenhuma ação de negócio é executada

#### Scenario: Autorização não pode ser burlada pela UI

- **WHEN** um usuário manipula o frontend para acionar endpoint fora de seu papel
- **THEN** o backend ainda responde `403`
- **AND** nenhuma regra de autorização depende exclusivamente da interface

### Requirement: Segredos e configuração

A integração MUST ser configurada por variáveis de ambiente e MUST NOT versionar ou expor segredos no frontend.

#### Scenario: Chaves por ambiente

- **WHEN** a aplicação é inicializada em qualquer ambiente
- **THEN** as chaves do Clerk são lidas de variáveis de ambiente
- **AND** apenas a chave publicável está presente no frontend
- **AND** `.env` permanece fora do versionamento

#### Scenario: Registro em auditoria de falhas de acesso

- **WHEN** uma requisição é rejeitada por autenticação ou autorização
- **THEN** o evento é registrado em logs estruturados sem conter tokens
