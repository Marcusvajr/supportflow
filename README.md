# SupportFlow

Aplicação web para centralização e acompanhamento de chamados técnicos em provedores de internet.

## Projeto acadêmico

Projeto incremental desenvolvido para a disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

Consulte:

- `docs/problem.md`
- `docs/prd.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/design.md`

## Stack priorizada

- Frontend: Next.js + React + TypeScript
- Backend: Node.js + NestJS
- Banco: PostgreSQL / Supabase
- ORM: Prisma
- Autenticação: Clerk
- CI/CD: GitHub Actions
- Frontend deploy: Vercel
- Observabilidade: Sentry
- E2E: Playwright
- Prototipação: Google Stitch
- Agente de IA priorizado: Google Antigravity

## Estrutura planejada

```text
supportflow/
├── apps/
│   ├── web/
│   └── api/
├── docs/
├── .github/
│   └── workflows/
├── .env.example
└── README.md
```

## Status da V1

### Discovery

- [x] Problem Statement
- [x] PRD
- [x] Especificação
- [x] Arquitetura
- [x] Design System
- [ ] Protótipos no Stitch
- [ ] Validação com usuários

### Delivery

- [ ] Frontend
- [ ] Backend
- [ ] Banco
- [ ] Autenticação
- [ ] Testes
- [ ] CI/CD
- [ ] Deploy

## Próximos passos

1. Gerar os protótipos no Stitch usando `docs/prd.md`, `docs/spec.md` e `docs/design.md`.
2. Validar os protótipos.
3. Implementar a aplicação.
4. Configurar os serviços externos.
5. Testar.
6. Publicar.
7. Preparar a apresentação final da V1.

## Pesquisa de validação

As principais evidências públicas estão descritas em `docs/problem.md`.

Importante: dados da Anatel demonstram relevância de atendimento e qualidade no setor, mas não provam diretamente a hipótese de fragmentação de informações dentro das equipes. Essa parte deve ser validada por entrevistas/observação.
