# Change 08 — Platform Compliance

## Why

O regulamento da disciplina exige requisitos não funcionais de portabilidade, observabilidade e implantação reproduzível. Esta mudança concentra esses itens para evitar espalhar decisões de infraestrutura pelas changes funcionais.

## What Changes

- logs estruturados e correlação por `request_id` no backend;
- captura de erros no Sentry;
- Dockerfiles para frontend e backend;
- imagens compatíveis com OCI;
- ambiente de execução reproduzível;
- Infraestrutura como Código para os recursos selecionados para a demonstração acadêmica;
- documentação de implantação e recriação de ambiente;
- pipeline com lint, testes, build e validações de infraestrutura.

## Impact

A mudança afeta a forma de empacotar, observar e recriar o ambiente, sem alterar as regras de negócio. Ela fecha os requisitos técnicos de plataforma previstos para a evolução acadêmica do projeto.

## Dependências

- `change-01-project-foundation`;
- `change-06-dashboard-and-search` para validação sobre uma aplicação funcional.

## Riscos

- **Complexidade excessiva de IaC para o prazo — Médio.** Mitigação: automatizar apenas os recursos necessários à demonstração e documentar limites.
- **Segredos em arquivos de infraestrutura — Médio.** Mitigação: variáveis/secret stores, nunca valores reais em código.
- **Diferenças entre ambiente local e nuvem — Médio.** Mitigação: containers e comandos reproduzíveis.

## Lint

- aplicação: obrigatório;
- arquivos de IaC: validação/formatador correspondente à ferramenta escolhida.

## Testes unitários

- utilitários de logging/correlação quando aplicável.

## Testes de integração

- propagação de `request_id`;
- health check em container;
- configuração sem segredo fixo.

## Testes E2E/aceite

- iniciar ambiente reproduzível;
- executar os dois fluxos de negócio previstos no roadmap;
- confirmar que falhas relevantes são observáveis.

## Critérios de aceite

- aplicação empacotada em containers compatíveis com OCI;
- procedimento de implantação automatizado por IaC documentado e versionado;
- ambiente pode ser recriado sem edição manual de código;
- segredos permanecem externalizados;
- logs permitem correlação básica de requisições.
