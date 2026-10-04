# Design — Change 08 Platform Compliance

## Observabilidade

Cada requisição recebe um `X-Request-Id` e um `traceparent` no formato W3C Trace Context. A API produz logs JSON estruturados contendo somente:

- timestamp;
- nível;
- serviço;
- evento;
- request_id;
- trace_id;
- caminho sem query string;
- método;
- status;
- duração.

Tokens, cookies, headers e payloads não são registrados.

O mesmo `request_id` é incluído em respostas Problem Details para correlação.

## Containers

Há Dockerfiles independentes para:

- `apps/api`;
- `apps/web`.

As imagens são construídas a partir de Node 24 e seguem o modelo OCI suportado pelo Docker/registry.

## Infraestrutura como Código

- `render.yaml`: serviço de API, build, start, health check e contrato de variáveis;
- `docker-compose.yml`: runtime reproduzível dos dois containers;
- migrations Supabase: esquema, índices, RLS, triggers e segurança versionados.

Segredos aparecem apenas como referências/variáveis, nunca como valores.

## Pipeline

O CI valida:

1. dependências;
2. lint;
3. testes;
4. build;
5. build dos dois containers;
6. smoke tests Playwright.
