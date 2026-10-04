# Design — Change 06 Dashboard and Search

## Objetivo

Transformar a fila de chamados em uma visão operacional, com agregações, busca, filtros combináveis, ordenação e paginação sem duplicar regras de negócio no frontend.

## API

### GET `/api/v1/dashboard/summary`

Retorna:

- total de chamados;
- totais por estado principal;
- críticos e altos ainda ativos;
- cinco chamados atualizados mais recentemente.

### GET `/api/v1/tickets`

Filtros suportados:

- `q`: protocolo, título, nome ou referência do cliente;
- `status`;
- `priority`;
- `category`;
- `assignedTo`;
- `page`;
- `pageSize`;
- `sortBy=updatedAt|createdAt`;
- `sortDirection=asc|desc`.

## Busca por cliente

Como a tabela de chamados referencia clientes, o repositório resolve IDs de clientes compatíveis com o texto informado e combina esses IDs com protocolo/título na consulta do ticket.

## Frontend

O dashboard consome o endpoint agregado, em vez de calcular indicadores a partir de uma página parcial. A fila expõe filtros e paginação de maneira responsiva.

## Limites

O resumo acadêmico lê no máximo 1000 registros por chamada. Para escala real, o próximo passo seria mover as contagens para uma função SQL/RPC agregada.
