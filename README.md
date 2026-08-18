# SupportFlow

Aplicação web para centralização e acompanhamento de chamados técnicos em provedores de internet.

## Projeto acadêmico

Projeto incremental desenvolvido para a disciplina **Práticas de Implementação e Evolução de Software**.

## Problema

O SupportFlow parte da hipótese de que informações técnicas fragmentadas durante o atendimento podem causar retrabalho, repetição de testes e perda de contexto em transferências e escalonamentos.

Consulte a documentação do processo de Discovery:

- `docs/problem.md`
- `docs/prd.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/design.md`

## Protótipo

O protótipo da aplicação foi desenvolvido no Google Stitch com base no PRD, especificação técnica e Design System do projeto.

**Google Stitch:**  
https://stitch.withgoogle.com/projects/5301597292888761257

Foram desenvolvidas as principais telas do MVP:

- Login
- Dashboard
- Lista de Chamados
- Novo Chamado
- Detalhes do Chamado
- Lista de Clientes
- Detalhes do Cliente

Durante a etapa de prototipação também foram explorados os recursos de Preview, Variations e protótipo interativo do Stitch.

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
