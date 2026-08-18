# Definição de Requisitos do Produto (PRD)

## Descrição do produto

### Problema

O problema é a dificuldade de manter o contexto técnico de chamados de suporte organizado e acessível durante todo o ciclo de atendimento.

Esse problema afeta profissionais de Help Desk, suporte técnico e, indiretamente, equipes de campo e supervisores, podendo causar repetição de procedimentos, demora para compreender o histórico e perda de contexto durante transferências.

### Solução

O **SupportFlow** resolve esse problema por meio de uma aplicação web para centralizar clientes, chamados, diagnósticos, testes realizados, observações, prioridade, status, responsável e histórico de alterações.

Para **atendentes**, o produto oferece uma visão única do chamado e reduz o esforço para reconstruir o contexto.

Para **supervisores**, oferece acompanhamento do volume, prioridade, status e distribuição dos chamados.

Para **equipes técnicas**, permite receber chamados encaminhados com histórico e evidências organizados.

### Diferenciais

- **Histórico técnico estruturado:** linha do tempo com ações, testes, diagnósticos e alterações.
- **Foco em suporte de ISP:** campos e fluxos pensados para problemas de conectividade.
- **Continuidade do atendimento:** visão única para reduzir perda de contexto.
- **MVP simples:** não depende de integrações complexas para gerar valor.
- **Evolução incremental:** preparado para futuras integrações com sistemas de rede e atendimento.

---

## Perfis de Usuário

### Atendente de Help Desk

#### Problemas

- Precisa localizar rapidamente o contexto de atendimentos anteriores.
- Pode repetir testes por falta de registro claro.
- Recebe chamados iniciados por outros atendentes.

#### Objetivos

- Registrar um chamado rapidamente.
- Consultar histórico, testes e diagnóstico em uma única tela.
- Atualizar status e encaminhar para outro responsável.

#### Dados demográficos

- Faixa etária: não determinante para o produto.
- Localização: provedores regionais de internet no Brasil.
- Outras características relevantes: uso frequente de sistemas web e ferramentas de suporte.

#### Motivações

- Resolver o problema do cliente com agilidade.
- Evitar retrabalho.
- Deixar um registro claro para continuidade do atendimento.

#### Frustrações

- Informações incompletas.
- Necessidade de procurar dados em diferentes locais.
- Repetição de procedimentos.

### Supervisor / Líder de Suporte

#### Problemas

- Dificuldade de identificar rapidamente chamados críticos ou parados.
- Necessidade de acompanhar distribuição e situação da operação.

#### Objetivos

- Visualizar chamados por status, prioridade e responsável.
- Identificar demandas que precisam de acompanhamento.
- Manter padronização mínima nos registros.

#### Dados demográficos

- Faixa etária: não determinante para o produto.
- Localização: provedores regionais de internet no Brasil.
- Outras características relevantes: experiência em operação de suporte.

#### Motivações

- Melhorar organização da equipe.
- Reduzir chamados sem acompanhamento.

#### Frustrações

- Chamados sem responsável claro.
- Registros pouco detalhados.
- Falta de visão consolidada.

---

## Funcionalidades

### Requisitos Funcionais

#### RF-01 Autenticação

- Objetivo: permitir acesso seguro aos usuários cadastrados.

#### RF-02 Dashboard

- Objetivo: apresentar visão resumida dos chamados por status, prioridade e responsável.

#### RF-03 Cadastro de clientes

- Objetivo: permitir cadastrar e consultar clientes fictícios/de demonstração vinculados aos chamados.

#### RF-04 Listagem de clientes

- Objetivo: localizar clientes por nome, documento mascarado ou identificador interno.

#### RF-05 Criação de chamado

- Objetivo: registrar um novo atendimento técnico com cliente, título, descrição, categoria, prioridade e responsável.

#### RF-06 Listagem de chamados

- Objetivo: permitir visualizar, pesquisar, filtrar e ordenar chamados.

#### RF-07 Detalhes do chamado

- Objetivo: apresentar todas as informações e o histórico técnico em uma única tela.

#### RF-08 Atualização de status

- Objetivo: permitir evolução do chamado entre Aberto, Em diagnóstico, Encaminhado e Resolvido.

#### RF-09 Definição de prioridade

- Objetivo: classificar chamados como Baixa, Média, Alta ou Crítica.

#### RF-10 Atribuição de responsável

- Objetivo: definir o profissional responsável pelo chamado.

#### RF-11 Registro de atividade técnica

- Objetivo: registrar testes executados, observações e evidências textuais.

#### RF-12 Registro de diagnóstico

- Objetivo: registrar hipótese ou diagnóstico técnico associado ao chamado.

#### RF-13 Histórico / linha do tempo

- Objetivo: registrar eventos relevantes do ciclo do chamado de forma cronológica.

#### RF-14 Busca e filtros

- Objetivo: filtrar chamados por cliente, status, prioridade, categoria e responsável.

#### RF-15 Encerramento de chamado

- Objetivo: permitir concluir o atendimento mediante registro de resolução.

---

## Requisitos Não Funcionais

### RNF-01 Segurança

- Autenticação obrigatória nas rotas privadas.
- Comunicação em HTTPS no ambiente publicado.
- Segredos apenas por variáveis de ambiente.
- Princípio de menor privilégio.

### RNF-02 Auditoria

- Alterações de status, prioridade, responsável e encerramento deverão gerar eventos no histórico.

### RNF-03 Observabilidade

- Erros de frontend e backend deverão ser capturados pelo Sentry.
- Logs do backend deverão ser estruturados.

### RNF-04 Escalabilidade

- O MVP deve suportar a carga acadêmica/demonstração sem arquitetura distribuída.
- A aplicação deverá permitir evolução horizontal no futuro.

### RNF-05 Portabilidade

- Código versionado no GitHub.
- Configuração por variáveis de ambiente.
- Banco PostgreSQL gerenciado pelo Supabase.

### RNF-06 Testabilidade

- Regras de negócio principais cobertas por testes unitários e/ou integração.
- Fluxos críticos validados com Playwright.

### RNF-07 Usabilidade

- Interfaces responsivas.
- Navegação consistente.
- Feedback visual para ações e erros.
- Formulários com validação.

### RNF-08 Desempenho

- Páginas principais devem carregar de forma aceitável em conexão comum de banda larga.
- Listagens utilizarão paginação.

---

## Métricas de Sucesso

### Métricas de Negócio

Como o produto ainda não possui operação real, os valores atuais são desconhecidos e deverão ser medidos em uma futura validação piloto.

- Tempo para compreender um chamado transferido
  - Valor atual: a medir.
  - Meta futura: redução de 20%.
  - Prazo: após piloto com usuários reais.

- Repetição de testes já executados
  - Valor atual: a medir.
  - Meta futura: redução de 25%.
  - Prazo: após piloto com usuários reais.

### Métricas de Produto

- 100% dos chamados com campos obrigatórios preenchidos.
- 100% das alterações críticas registradas na linha do tempo.
- Usuário consegue localizar chamado por busca/filtros.
- Fluxo de criação até resolução executável sem acesso administrativo ao banco.

### Métricas de Operação

- Erros não tratados monitorados pelo Sentry.
- Disponibilidade conforme infraestrutura gratuita utilizada.
- Pipeline CI executado em pull requests e branch principal.

---

## Premissas e Restrições

### Premissas

- O usuário possui navegador moderno.
- O ambiente de demonstração utilizará dados fictícios.
- O projeto será desenvolvido como aplicação web.
- A primeira versão será usada para fins acadêmicos.

### Restrições

- Prazo limitado da disciplina.
- Preferência por serviços gratuitos ou de baixo custo.
- Sem acesso a integrações reais de provedores no MVP.
- Sem dados pessoais reais de clientes.

### Dependências Externas

- GitHub.
- Vercel.
- Supabase.
- Clerk.
- Sentry.

---

## Escopo

### MVP

#### Incluído

- Login e logout.
- Dashboard.
- Clientes.
- Criação e edição básica de chamados.
- Listagem e filtros de chamados.
- Detalhes do chamado.
- Prioridade e status.
- Atribuição de responsável.
- Registro de testes/observações.
- Diagnóstico.
- Linha do tempo.
- Resolução do chamado.
- Testes principais.
- Deploy.

#### Não Incluído

- Integração com OLT/ONU/ONT.
- Provisionamento de roteadores.
- Integração com WhatsApp.
- Integração com sistemas comerciais/ERP.
- Aplicativo mobile nativo.
- IA para diagnóstico automático.
- Anexos de grande porte.

### Versão 1.0

- Anexos de evidências.
- Indicadores de SLA.
- Catálogo padronizado de diagnósticos.
- Gestão básica de equipes.
- Exportação de relatórios.

### Versões Futuras

- Integrações com equipamentos e sistemas de rede.
- Sugestões de diagnóstico assistidas por IA.
- Base de conhecimento.
- Alertas e automações.
- Métricas operacionais avançadas.
- Integração com mensageria.

---

## Critérios de Aceitação do Produto

### Critérios de Negócio

- Um atendente autenticado consegue registrar um chamado completo.
- Outro atendente autorizado consegue compreender o histórico do chamado sem depender do atendente original.
- O supervisor consegue localizar chamados por prioridade, status e responsável.

### Critérios Técnicos

- Frontend e backend integrados.
- Persistência em PostgreSQL/Supabase.
- Autenticação via Clerk.
- Aplicação publicada.
- API documentada.
- Pipeline de CI configurado.

### Critérios de Qualidade

- Sem segredos versionados no repositório.
- Fluxos críticos testados.
- Interface consistente com o design system.
- Erros relevantes observáveis no Sentry.

---

## Riscos

### Riscos de Negócio

- **Problema interno não validado diretamente com usuários**
  - Probabilidade: MÉDIA
  - Impacto: ALTO
  - Mitigação: entrevistar 3 a 5 profissionais de suporte antes de congelar o escopo.

- **Escopo excessivo para o prazo**
  - Probabilidade: ALTA
  - Impacto: ALTO
  - Mitigação: manter integrações e automações fora do MVP.

### Riscos Técnicos

- **Complexidade da integração Clerk + NestJS**
  - Probabilidade: MÉDIA
  - Impacto: MÉDIO
  - Mitigação: implementar autenticação no início e criar prova de conceito antes dos demais módulos.

- **Múltiplos serviços externos**
  - Probabilidade: MÉDIA
  - Impacto: MÉDIO
  - Mitigação: isolar configurações e evitar dependência de recursos premium.

- **Deploy separado de frontend e backend**
  - Probabilidade: MÉDIA
  - Impacto: MÉDIO
  - Mitigação: validar estratégia de deploy nas primeiras iterações.

---

## Fora de Escopo

- Automação direta de equipamentos de rede.
- Acesso remoto a equipamentos de clientes.
- Dados reais de assinantes.
- Billing/faturamento.
- CRM comercial.
- Aplicativo para consumidor final.
- Diagnóstico automático por IA no MVP.

---

## Glossário

### Termos de Negócio

- **Chamado:** registro de uma demanda de suporte.
- **Atividade técnica:** teste, observação ou procedimento executado durante o atendimento.
- **Diagnóstico:** hipótese ou conclusão técnica sobre a causa do problema.
- **Linha do tempo:** histórico cronológico dos eventos do chamado.
- **Escalonamento:** transferência do atendimento para outro profissional ou nível de suporte.

### Siglas

- **ISP:** Internet Service Provider.
- **MVP:** Minimum Viable Product.
- **PRD:** Product Requirements Document.
- **SLA:** Service Level Agreement.
- **CI/CD:** Continuous Integration / Continuous Delivery.
