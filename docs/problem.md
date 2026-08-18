# Definição do Problema

## Problema

### Descrição

Profissionais de Help Desk e suporte técnico de provedores regionais de internet precisam registrar, consultar e dar continuidade a atendimentos relacionados a indisponibilidade, lentidão, quedas, Wi-Fi, equipamentos e outros problemas de conectividade.

Em muitos fluxos de atendimento, o contexto técnico necessário para continuar um chamado pode ficar distribuído entre sistemas de atendimento, anotações, conversas internas e ferramentas de diagnóstico. Quando o registro não concentra de forma estruturada o problema relatado, os testes já realizados, as evidências coletadas, o diagnóstico e o próximo passo, o atendimento pode exigir nova coleta de informações ou repetição de procedimentos.

A hipótese central deste projeto é que a fragmentação e a falta de padronização do histórico técnico dificultam a continuidade do atendimento e aumentam o retrabalho.

> **Hipótese a validar no Discovery:** os dados públicos confirmam a relevância da qualidade e do atendimento no setor de banda larga, mas não medem diretamente a fragmentação interna dos registros. Essa hipótese deverá ser validada com entrevistas ou observação de profissionais de suporte.

### Contexto Atual

O atendimento técnico de um provedor normalmente envolve diferentes informações:

- identificação do cliente;
- serviço ou plano contratado;
- descrição do problema;
- equipamento utilizado;
- testes realizados;
- evidências e observações;
- diagnóstico;
- prioridade;
- responsável atual;
- histórico de alterações;
- eventual encaminhamento para outro nível de suporte ou equipe de campo.

Quando essas informações não estão reunidas em uma visão única e de fácil consulta, um novo atendente pode precisar reconstruir o contexto do chamado.

O problema é especialmente relevante em operações nas quais há troca de responsável, escalonamento ou retorno do cliente após um atendimento anterior.

### Impactos

- Repetição de testes e perguntas já realizados em contatos anteriores.
- Maior tempo para compreender o histórico do chamado.
- Possibilidade de perda de contexto durante transferências e escalonamentos.
- Dificuldade para identificar problemas recorrentes.
- Menor padronização dos registros técnicos.
- Dificuldade para acompanhar o andamento e a responsabilidade pelo atendimento.

### Evidências

- O **Panorama de Reclamações 2025 da Anatel** registrou **470.875 reclamações de banda larga fixa em 2025**, aumento de **6,47%** em relação a 2024.
- Dentro de banda larga fixa, o assunto **Atendimento** passou de **20.628 reclamações em 2024 para 22.573 em 2025**, aumento de **9,43%**.
- Mesmo com redução no assunto "Qualidade, Funcionamento e Reparo", ele ainda somou **131.236 reclamações de banda larga fixa em 2025**, mostrando que questões técnicas continuam relevantes.
- A Anatel estabelece que todo atendimento deve gerar protocolo capaz de rastrear a demanda, reforçando a importância de histórico e rastreabilidade no atendimento.
- O Regulamento de Qualidade dos Serviços de Telecomunicações (RQUAL) considera indicadores ligados tanto à rede quanto ao atendimento, incluindo tempo médio de atendimento e tratamento de reclamações.

**Fontes públicas utilizadas na validação:**

1. ANATEL. *Panorama de Reclamações 2025*.  
   https://www.gov.br/anatel/pt-br/assuntos/noticias/anatel-registra-aumento-nas-reclamacoes-de-servicos-de-telecomunicacoes-em-2025/panorama_de_reclamacoes_2025.pdf/@@display-file/file

2. ANATEL. *Atendimento — Conheça seus direitos*.  
   https://www.gov.br/anatel/pt-br/consumidor/conheca-seus-direitos/atendimento

3. ANATEL. *Regulamento de Qualidade dos Serviços de Telecomunicações*.  
   https://www.gov.br/anatel/pt-br/dados/qualidade/qualidade-dos-servicos/regulamento

### Hipóteses a validar com usuários

Para complementar a pesquisa documental, o projeto considera as seguintes hipóteses:

- atendentes gastam tempo procurando informações de contatos anteriores;
- diagnósticos são registrados com níveis diferentes de detalhamento;
- a troca de responsável pode gerar perda de contexto;
- uma linha do tempo única do chamado reduziria a necessidade de repetir procedimentos;
- filtros por cliente, status, prioridade e responsável facilitariam o acompanhamento da operação.

Sugestão de validação: realizar de 3 a 5 entrevistas curtas com profissionais de Help Desk/suporte técnico.

---

## Objetivo

### Objetivo Principal

Desenvolver uma aplicação web capaz de centralizar e organizar o histórico técnico dos chamados de suporte de um provedor de internet, permitindo que os profissionais visualizem rapidamente o contexto do problema, os testes realizados, o diagnóstico, o responsável e o andamento do atendimento.

### Objetivos Específicos

- Centralizar os principais dados de um chamado técnico.
- Manter histórico cronológico das interações e alterações.
- Permitir registro estruturado de testes, diagnóstico e observações.
- Facilitar busca e filtragem de chamados.
- Permitir definição de prioridade, status e responsável.
- Reduzir a necessidade de reconstrução manual do contexto durante a continuidade do atendimento.
- Criar uma base que possa futuramente receber integrações com ferramentas de rede e atendimento.

### Critérios de Sucesso

Para o MVP acadêmico:

- 100% dos chamados criados devem possuir cliente, descrição, status, prioridade e responsável.
- O usuário deve conseguir consultar todo o histórico técnico de um chamado em uma única tela.
- O sistema deve permitir criar, atualizar, atribuir e concluir chamados.
- Os principais fluxos devem possuir testes automatizados.
- A aplicação deve estar publicada e acessível por URL.
- O produto deve possuir documentação de problema, requisitos, especificação, arquitetura e design.

Para uma validação futura em ambiente real:

- Reduzir a repetição de testes já executados.
- Reduzir o tempo necessário para um atendente compreender um chamado transferido.
- Aumentar a padronização dos registros técnicos.

---

## Público-Alvo

### Perfil Principal

Profissionais de Help Desk e suporte técnico que atuam em provedores regionais de internet e precisam registrar, diagnosticar, acompanhar e encaminhar chamados técnicos.

### Características

- Utilizam computador como principal ferramenta de trabalho.
- Atendem múltiplos clientes durante o expediente.
- Precisam consultar informações rapidamente.
- Trabalham com problemas de conectividade, Wi-Fi, equipamentos e indisponibilidade.
- Podem transferir ou escalar atendimentos para outros profissionais ou equipes.

### Necessidades

- Visualizar rapidamente o histórico do cliente e do chamado.
- Saber quais testes já foram realizados.
- Identificar o diagnóstico ou hipótese atual.
- Saber quem está responsável pelo atendimento.
- Localizar chamados por cliente, protocolo, status ou prioridade.
- Registrar informações de forma simples sem tornar o atendimento mais lento.

### Restrições

- O MVP não terá integração direta com OLT, ONT, roteadores, CRM, ERP ou plataformas de mensageria.
- O sistema deverá funcionar bem em navegadores modernos e desktop, principal cenário operacional.
- O projeto deve utilizar serviços com plano gratuito ou baixo custo sempre que possível.
- Dados reais de clientes não deverão ser utilizados no ambiente acadêmico/demonstração.
- Informações sensíveis deverão seguir princípios de minimização e controle de acesso.
