# Modelos de Arquitetura — SupportFlow

Este documento complementa `docs/architecture.md` com os modelos solicitados no regulamento da disciplina.

## 1. Modelo de Contexto

```mermaid
flowchart LR
    Agent[Atendente de Help Desk]
    Supervisor[Supervisor]
    SupportFlow[SupportFlow]
    Clerk[Clerk]
    AI[Provedor de IA]
    Obs[Observabilidade]

    Agent -->|HTTPS| SupportFlow
    Supervisor -->|HTTPS| SupportFlow
    SupportFlow -->|Autenticação e sessão| Clerk
    SupportFlow -.->|Resumo assistivo| AI
    SupportFlow -.->|Erros e eventos| Obs
```

O SupportFlow é uma aplicação web interna. Clerk é a fonte externa de identidade; regras de perfil e autorização permanecem no domínio da aplicação.

## 2. Modelo de Contêineres

```mermaid
flowchart TB
    Browser[Navegador]
    Web[Frontend Next.js\nVercel]
    Api[API NestJS\nRender]
    Db[(PostgreSQL / Supabase)]
    Clerk[Clerk]
    AI[Provedor de IA]
    Obs[Sentry / logs estruturados]

    Browser -->|HTTPS| Web
    Web -->|REST + Bearer token| Api
    Browser -->|Fluxo de autenticação| Clerk
    Api -->|Valida token| Clerk
    Api -->|Persistência| Db
    Api -.->|Resumo sob demanda| AI
    Web -.->|Erros frontend| Obs
    Api -.->|Logs/erros| Obs
```

## 3. Modelo de Componentes do Backend

```mermaid
flowchart LR
    Controllers[Controllers REST]
    Auth[Auth Module]
    Customers[Customers Module]
    Tickets[Tickets Module]
    Activities[Activities Module]
    Dashboard[Dashboard Module]
    AI[AI Summary Module]
    Repositories[Repositories]
    Database[(PostgreSQL)]

    Controllers --> Auth
    Controllers --> Customers
    Controllers --> Tickets
    Controllers --> Activities
    Controllers --> Dashboard
    Tickets --> Repositories
    Customers --> Repositories
    Activities --> Repositories
    Dashboard --> Repositories
    AI --> Repositories
    Repositories --> Database
```

As regras de negócio ficam nos serviços do backend. O frontend nunca acessa o banco diretamente.

## 4. Modelo de Classes do Domínio

```mermaid
classDiagram
    class User {
      +id: string
      +externalAuthId: string
      +name: string
      +email: string
      +role: AGENT|SUPERVISOR
      +active: boolean
    }

    class Customer {
      +id: string
      +referenceCode: string
      +name: string
      +documentMasked: string?
      +phoneMasked: string?
      +city: string?
      +createdAt: DateTime
      +updatedAt: DateTime
    }

    class Ticket {
      +id: string
      +protocol: string
      +title: string
      +description: string
      +status: TicketStatus
      +priority: TicketPriority
      +customerId: string
      +assignedToUserId: string
      +resolvedAt: DateTime?
    }

    class TicketActivity {
      +id: string
      +ticketId: string
      +authorUserId: string
      +type: ActivityType
      +description: string
      +createdAt: DateTime
    }

    class AuditEvent {
      +id: string
      +ticketId: string
      +actorUserId: string
      +eventType: string
      +createdAt: DateTime
    }

    Customer "1" --> "*" Ticket
    User "1" --> "*" Ticket : responsável
    Ticket "1" --> "*" TicketActivity
    User "1" --> "*" TicketActivity : autor
    Ticket "1" --> "*" AuditEvent
```

## 5. Modelo de Implantação

```mermaid
flowchart TB
    UserDevice[Dispositivo do usuário\nNavegador moderno]
    Internet[Internet / HTTPS]
    Vercel[Vercel\nNext.js]
    Render[Render\nNestJS]
    Supabase[Supabase\nPostgreSQL]
    Clerk[Clerk\nIdentidade]
    GitHub[GitHub\nCódigo + CI/CD]

    UserDevice --> Internet
    Internet --> Vercel
    Vercel --> Render
    UserDevice --> Clerk
    Render --> Clerk
    Render --> Supabase
    GitHub -->|Deploy| Vercel
    GitHub -->|Deploy| Render
```

## 6. Restrições e decisões

- comunicação externa somente por HTTPS;
- API versionada sob `/api/v1`;
- segredos somente no backend e em variáveis de ambiente;
- dados acadêmicos exclusivamente fictícios;
- autenticação externa via Clerk, autorização interna via SupportFlow;
- persistência relacional em PostgreSQL;
- frontend sem acesso direto ao banco;
- IA será assistiva e não poderá alterar estado do chamado automaticamente.
