# Implantação e portabilidade — SupportFlow

## Visão geral

O SupportFlow possui três formas complementares de implantação:

1. **nuvem publicada**: frontend na Vercel, API no Render e PostgreSQL no Supabase;
2. **containers OCI**: Dockerfiles versionados para frontend e backend;
3. **automação declarativa**: `render.yaml` e `docker-compose.yml` versionados no repositório.

Nenhum segredo é armazenado nesses arquivos. Valores sensíveis permanecem em variáveis de ambiente das plataformas.

## Containers OCI

### API

```bash
docker build -f apps/api/Dockerfile -t supportflow-api .
docker run --rm -p 3001:3001 --env-file .env supportflow-api
```

### Frontend

O frontend recebe somente variáveis públicas no build. A publishable key do Clerk pode ser passada como build argument.

```bash
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -t supportflow-web .
```

## Ambiente completo local

```bash
docker compose up --build
```

A aplicação ficará em:

- frontend: `http://localhost:3000`;
- API: `http://localhost:3001/api/v1`;
- health: `http://localhost:3001/api/v1/health`.

O banco permanece gerenciado pelo Supabase, mantendo o mesmo contrato REST usado no ambiente publicado.

## Infraestrutura como Código

O arquivo `render.yaml` descreve o serviço de API, build, start, health check e variáveis esperadas. Valores secretos usam `sync: false` e devem ser preenchidos pelo operador/plataforma.

O `docker-compose.yml` descreve os dois containers da aplicação e suas dependências. Juntos, esses artefatos permitem recriar o runtime sem alterações manuais no código.

## Observabilidade

Cada requisição da API recebe:

- `X-Request-Id`;
- `traceparent` compatível com o formato W3C Trace Context;
- log JSON estruturado com rota sem query string, método, status e duração.

Headers, cookies, tokens e payloads não são incluídos no log de acesso.

Falhas HTTP utilizam Problem Details e retornam o mesmo `request_id` para correlação com os logs da API.

## IA assistiva

O recurso de resumo é opcional e configurado somente no backend:

- `AI_PROVIDER_URL`;
- `AI_API_KEY`;
- `AI_MODEL`.

Sem credencial, o endpoint retorna falha controlada e todo o restante do atendimento continua funcional. O resumo não altera automaticamente o chamado.

## Recriação do ambiente

1. provisionar PostgreSQL/Supabase e aplicar as migrations em `supabase/migrations`;
2. cadastrar as variáveis seguras da API;
3. implantar a API pelo Blueprint do Render ou pelo Dockerfile;
4. configurar a URL da API e as chaves públicas do Clerk no frontend;
5. implantar o frontend na Vercel ou pelo Dockerfile;
6. validar `/api/v1/health` e executar os fluxos de aceite.

## Limites acadêmicos

O ambiente utiliza apenas dados fictícios. Alta disponibilidade real depende dos planos e regiões contratados nas plataformas, mas a aplicação permanece portável por ser empacotada e configurada externamente.
