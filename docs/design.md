# Design System — SupportFlow

## 1. Objetivo

Definir uma linguagem visual consistente para o SupportFlow e servir como referência para a geração dos protótipos no Stitch e para a implementação do frontend em Next.js.

O produto deve transmitir:

- clareza;
- organização;
- confiabilidade;
- agilidade operacional;
- foco em leitura rápida de informações.

## 2. Princípios de UX

### Clareza antes de decoração

A interface deve priorizar leitura rápida de chamados, status e histórico.

### Contexto sempre visível

Nas telas de atendimento, protocolo, cliente, status, prioridade e responsável devem permanecer facilmente identificáveis.

### Menos cliques

Ações frequentes devem ficar próximas do conteúdo relacionado.

### Feedback imediato

Salvar, alterar status, atribuir responsável e resolver chamado devem apresentar confirmação visual.

### Segurança contra erro

Ações de impacto, como resolver ou reabrir um chamado, devem exigir confirmação quando apropriado.

## 3. Tema Visual

Direção: **SaaS operacional moderno**, profissional e limpo.

Evitar:

- aparência excessivamente "gamer";
- excesso de gradientes;
- glassmorphism intenso;
- muitas cores concorrentes;
- cards decorativos sem função.

## 4. Cores

### Base

- `--background`: `#F6F8FB`
- `--surface`: `#FFFFFF`
- `--surface-muted`: `#F1F5F9`
- `--text-primary`: `#0F172A`
- `--text-secondary`: `#475569`
- `--border`: `#E2E8F0`

### Marca

- `--primary-50`: `#EFF6FF`
- `--primary-100`: `#DBEAFE`
- `--primary-500`: `#3B82F6`
- `--primary-600`: `#2563EB`
- `--primary-700`: `#1D4ED8`

### Estados

- Sucesso: `#16A34A`
- Atenção: `#D97706`
- Erro/Crítico: `#DC2626`
- Informação: `#0284C7`
- Neutro: `#64748B`

### Prioridades

- Baixa: neutro.
- Média: azul.
- Alta: âmbar.
- Crítica: vermelho.

Não depender apenas da cor: sempre exibir rótulo textual.

## 5. Tipografia

Família sugerida:

- Inter;
- alternativa: Geist.

Escala:

- Display: 32/40, semibold.
- H1: 28/36, semibold.
- H2: 22/30, semibold.
- H3: 18/26, semibold.
- Body: 14/22 ou 16/24.
- Small: 12/18.
- Label: 13/18, medium.

## 6. Espaçamento

Escala base de 4 px:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

## 7. Bordas e Elevação

- Radius pequeno: 6 px.
- Radius padrão: 10 px.
- Radius grande: 14 px.
- Sombras discretas.
- Bordas leves em cards e tabelas.

## 8. Layout

### Desktop

- Sidebar fixa/recolhível.
- Topbar com título, busca/atalhos e usuário.
- Conteúdo com largura fluida.
- Grid de dashboard.

### Mobile/Tablet

- Sidebar vira drawer.
- Tabelas podem virar listas/cards.
- Ações principais permanecem acessíveis.

## 9. Componentes

### Navegação

- Sidebar.
- Breadcrumb.
- User menu.
- Page header.

### Entrada

- Input.
- Textarea.
- Select.
- Combobox.
- Search.
- Date/time quando necessário.
- Checkbox.
- Radio.

### Ações

- Primary button.
- Secondary button.
- Ghost button.
- Destructive button.
- Icon button.

### Feedback

- Toast.
- Alert.
- Inline validation.
- Skeleton.
- Empty state.
- Error state.
- Loading state.

### Dados

- Card de métrica.
- Data table.
- Badge.
- Avatar.
- Pagination.
- Timeline.
- Description list.

### Chamados

- TicketStatusBadge.
- TicketPriorityBadge.
- TicketCard.
- TicketTimeline.
- ActivityComposer.
- AssigneeSelector.
- ResolutionDialog.

## 10. Estados dos Chamados

### Aberto

Rótulo: `Aberto`

Descrição: chamado criado e aguardando/iniciando tratamento.

### Em diagnóstico

Rótulo: `Em diagnóstico`

Descrição: equipe está realizando análise e testes.

### Encaminhado

Rótulo: `Encaminhado`

Descrição: chamado direcionado para outro responsável ou nível.

### Resolvido

Rótulo: `Resolvido`

Descrição: solução registrada e atendimento encerrado.

## 11. Telas do Protótipo

### Tela 01 — Login

Conteúdo:

- logo SupportFlow;
- mensagem curta;
- autenticação;
- visual simples.

### Tela 02 — Dashboard

Conteúdo:

- cards: abertos, em diagnóstico, encaminhados, críticos;
- chamados recentes;
- distribuição por status;
- ação "Novo chamado".

### Tela 03 — Lista de Chamados

Conteúdo:

- busca;
- filtros;
- tabela;
- paginação;
- badges de status/prioridade.

### Tela 04 — Novo Chamado

Conteúdo:

- cliente;
- título;
- categoria;
- descrição;
- prioridade;
- responsável;
- ações salvar/cancelar.

### Tela 05 — Detalhes do Chamado

Conteúdo:

- protocolo;
- cliente;
- status;
- prioridade;
- responsável;
- descrição;
- diagnóstico atual;
- ações;
- linha do tempo.

### Tela 06 — Clientes

Conteúdo:

- busca;
- lista;
- quantidade de chamados;
- último atendimento.

### Tela 07 — Detalhes do Cliente

Conteúdo:

- dados básicos fictícios;
- chamados ativos;
- histórico de chamados.

## 12. Acessibilidade

- contraste compatível com WCAG AA sempre que possível;
- navegação por teclado;
- foco visível;
- labels associados a campos;
- ícones com texto/aria-label;
- cores nunca como única indicação;
- tamanho mínimo confortável para alvos de interação.

## 13. Conteúdo e Microcopy

Tom:

- profissional;
- direto;
- sem linguagem excessivamente formal;
- orientado à ação.

Exemplos:

- `Novo chamado`
- `Registrar teste`
- `Adicionar diagnóstico`
- `Encaminhar`
- `Resolver chamado`
- `Nenhum chamado encontrado`
- `As alterações foram salvas`

## 14. Prompt Base para o Stitch

```text
Crie uma aplicação web SaaS chamada SupportFlow para gerenciamento de chamados
técnicos de provedores de internet.

Público principal: profissionais de Help Desk e suporte técnico.

Objetivo de UX: permitir que o atendente compreenda rapidamente o contexto de um
chamado, veja o que já foi testado e dê continuidade ao atendimento sem perder
informações.

Estilo:
- moderno;
- profissional;
- limpo;
- desktop-first;
- SaaS operacional;
- fundo cinza muito claro;
- superfícies brancas;
- cor primária azul;
- tipografia Inter ou equivalente;
- bordas e sombras discretas;
- alta legibilidade.

Crie as seguintes telas:
1. Login.
2. Dashboard.
3. Lista de chamados com pesquisa e filtros.
4. Novo chamado.
5. Detalhes do chamado com linha do tempo.
6. Lista de clientes.
7. Detalhes do cliente com histórico.

Status:
- Aberto
- Em diagnóstico
- Encaminhado
- Resolvido

Prioridades:
- Baixa
- Média
- Alta
- Crítica

Na tela de detalhes do chamado, dê destaque para:
- protocolo;
- cliente;
- status;
- prioridade;
- responsável;
- descrição;
- diagnóstico atual;
- testes realizados;
- linha do tempo;
- ações Registrar teste, Adicionar diagnóstico, Encaminhar e Resolver.

Evite excesso de gradientes e elementos decorativos. A interface deve parecer uma
ferramenta real de trabalho utilizada durante vários atendimentos por dia.
```

## 15. Validação dos Protótipos

Após gerar no Stitch:

1. Avaliar hierarquia visual.
2. Abrir Preview / New Tab.
3. Gerar ao menos uma Variation da tela de detalhes.
4. Conferir consistência entre as telas.
5. Selecionar todas e gerar o protótipo.
6. Usar Interact para validar o fluxo.
7. Renomear o projeto para `SupportFlow`.
8. Registrar ajustes relevantes para a apresentação.
