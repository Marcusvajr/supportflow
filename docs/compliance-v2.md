# Conformidade da Entrega Incremental v2

Este documento registra os requisitos adicionais do regulamento da disciplina que orientam a evolução do SupportFlow a partir da entrega incremental v2.

## Requisitos acadêmicos incorporados ao planejamento

1. **Testabilidade:** manter testes automatizados de unidade, integração e aceite para as mudanças compatíveis com cada nível de teste.
2. **Portabilidade e implantação:** evoluir a solução para empacotamento em contêineres compatíveis com OCI e implantação automatizada por Infraestrutura como Código, permitindo recriação de ambiente.
3. **Persistência:** utilizar banco relacional PostgreSQL, com Supabase como serviço gerenciado previsto.
4. **Governança de código e configuração:** dependências declaradas e versionadas, configurações externalizadas por variáveis de ambiente e código-fonte versionado no GitHub.
5. **Fluxos ponta a ponta:** entregar pelo menos dois fluxos de negócio completos, e não apenas cadastros ou telas isoladas.
6. **Recurso tecnológico adicional:** incorporar pelo menos um recurso de inteligência artificial, blockchain, IoT ou tecnologia equivalente. Para o SupportFlow, a escolha é um recurso de IA assistiva para resumir contexto técnico de chamados, sem substituir a decisão do atendente.

## Ajuste de escopo em relação aos documentos anteriores

Alguns documentos de Discovery tratavam IA e IaC como evoluções futuras ou fora do MVP. Para atender ao regulamento da disciplina, esta entrega passa a considerar:

- **IA assistiva de resumo de contexto** como requisito acadêmico planejado para o produto incremental;
- **containerização + IaC** como requisito técnico planejado para a evolução da solução;
- **IA autônoma de diagnóstico** continua fora do escopo, preservando a decisão técnica anterior de não automatizar decisões operacionais críticas.

Em caso de conflito de escopo, este documento complementa os arquivos `docs/prd.md`, `docs/spec.md` e `docs/architecture.md` exclusivamente para fins de conformidade da disciplina.

## Dois fluxos de negócio ponta a ponta planejados

### Fluxo A — Atendimento completo de um chamado

1. usuário autenticado acessa o sistema;
2. localiza ou cadastra cliente fictício;
3. cria chamado;
4. registra teste técnico;
5. registra diagnóstico;
6. altera o status de acordo com as regras;
7. registra resolução;
8. chamado é encerrado com histórico auditável.

### Fluxo B — Escalonamento e continuidade do atendimento

1. usuário autenticado abre chamado existente;
2. registra atividade e identifica necessidade de escalonamento;
3. altera status para `ESCALATED`;
4. supervisor reatribui o chamado;
5. novo responsável registra continuidade do diagnóstico;
6. chamado é resolvido;
7. supervisor pode reabrir quando necessário;
8. todo o ciclo permanece disponível na linha do tempo.

## Mapeamento para o roadmap

- `change-01-project-foundation`: estrutura inicial do monorepo e health check.
- `change-02-auth-clerk`: autenticação e autorização.
- `change-03-customer-management`: clientes fictícios.
- `change-04-ticket-lifecycle`: criação, atualização de status e resolução.
- `change-05-ticket-activities`: testes, diagnósticos e histórico.
- `change-06-dashboard-and-search`: consulta operacional e filtros.
- `change-07-ai-ticket-summary`: IA assistiva para resumo técnico.
- `change-08-platform-compliance`: observabilidade, contêineres OCI e IaC.

## Regra de conclusão das mudanças

Uma mudança funcional não deve ser considerada concluída sem validações compatíveis com sua natureza. Sempre que aplicável, o ciclo inclui:

- lint;
- teste unitário;
- teste de integração;
- teste E2E/aceite;
- build;
- verificação manual do fluxo.
