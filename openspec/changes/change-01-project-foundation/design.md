# Design — Change 01 Project Foundation

## Decisões

### Monorepo

Usar npm workspaces na raiz com dois aplicativos independentes:

```text
apps/
├── web/
└── api/
```

A raiz apenas coordena comandos; regras de negócio permanecerão no backend.

### Frontend

- Next.js com App Router;
- TypeScript em modo estrito;
- conteúdo inicial estático apenas para validar a fundação;
- porta padrão 3000.

### Backend

- NestJS;
- TypeScript em modo estrito;
- prefixo configurável por `GLOBAL_PREFIX`, com padrão `api/v1`;
- porta configurável por `BACKEND_PORT`, com padrão 3001;
- módulo inicial contendo somente health check.

### Health check

Endpoint:

```text
GET /api/v1/health
```

Resposta mínima:

```json
{
  "status": "ok",
  "service": "supportflow-api"
}
```

### Testes

O health controller é coberto por teste unitário simples. Testes de integração HTTP e Playwright serão incrementados quando houver os fluxos correspondentes.

### CI

O workflow executará:

1. checkout;
2. configuração do Node;
3. `npm install`;
4. `npm run lint`;
5. `npm run test`;
6. `npm run build`.

## Segurança

- nenhum segredo no código;
- `.env` local permanece ignorado;
- a fundação não acessa Supabase nem Clerk antes das mudanças específicas.

## Evolução

Esta estrutura deve permitir que autenticação, persistência e módulos de domínio sejam adicionados sem mover regras para o frontend.
