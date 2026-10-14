export type FeatureStatus = 'implementado' | 'fluxo-a-validar' | 'externo-pendente';

export type Feature = {
  number: string;
  title: string;
  text: string;
  detail: string;
  status: FeatureStatus;
};

/** Recursos do produto; status refere-se à implementação e à validação externa. */
export const featureCatalog: Feature[] = [
  {
    "number": "01",
    "title": "Acesso seguro e sessão",
    "text": "Autenticação pelo Clerk e proteção de páginas privadas.",
    "detail": "O usuário entra com sua conta, recebe uma sessão e usa o sistema conforme a autorização concedida.",
    "status": "implementado"
  },
  {
    "number": "02",
    "title": "Papéis e permissões",
    "text": "Perfis de atendente e supervisor, com verificações no backend.",
    "detail": "Atendentes realizam atividades de suporte; determinadas ações, como reatribuir responsáveis e reabrir chamados resolvidos, exigem supervisor. Fluxo completo de supervisor publicado ainda precisa de validação.",
    "status": "fluxo-a-validar"
  },
  {
    "number": "03",
    "title": "Painel operacional",
    "text": "Indicadores, visão da fila e atalhos de atendimento.",
    "detail": "O dashboard consulta os chamados e apresenta métricas para acompanhar a operação.",
    "status": "implementado"
  },
  {
    "number": "04",
    "title": "Gestão de clientes",
    "text": "Cadastro, consulta, busca e atualização de clientes fictícios.",
    "detail": "Os dados ficam armazenados no PostgreSQL do Supabase e são associados aos chamados.",
    "status": "implementado"
  },
  {
    "number": "05",
    "title": "Abertura de chamado",
    "text": "Registro de cliente, descrição, categoria e prioridade com protocolo único.",
    "detail": "A API valida os campos, cria o atendimento e mantém a referência para consultas posteriores.",
    "status": "implementado"
  },
  {
    "number": "06",
    "title": "Fila, pesquisa e filtros",
    "text": "Localização de chamados por pesquisa, status, prioridade e outras informações disponíveis.",
    "detail": "A listagem facilita encontrar e acompanhar atendimentos, com paginação conforme o fluxo implementado.",
    "status": "implementado"
  },
  {
    "number": "07",
    "title": "Detalhes e contexto",
    "text": "Visão unificada dos dados do chamado e do cliente.",
    "detail": "O profissional consulta a descrição, os responsáveis, as atividades e a evolução do caso.",
    "status": "implementado"
  },
  {
    "number": "08",
    "title": "Situação do atendimento",
    "text": "Evolução entre aberto, em diagnóstico, encaminhado e resolvido.",
    "detail": "As transições seguem regras de negócio; a reabertura de chamado resolvido é restrita ao supervisor.",
    "status": "implementado"
  },
  {
    "number": "09",
    "title": "Prioridades",
    "text": "Classificação em baixa, média, alta e crítica.",
    "detail": "Ajuda a organizar a fila e destacar chamados com maior urgência.",
    "status": "implementado"
  },
  {
    "number": "10",
    "title": "Atividades técnicas",
    "text": "Registro de observações, testes e diagnósticos.",
    "detail": "Cada registro descreve o que foi feito ou identificado para evitar repetição de procedimentos.",
    "status": "implementado"
  },
  {
    "number": "11",
    "title": "Resolução",
    "text": "Encerramento com descrição obrigatória da solução aplicada.",
    "detail": "A resolução é preservada para consulta posterior e registrada no histórico.",
    "status": "implementado"
  },
  {
    "number": "12",
    "title": "Linha do tempo e auditoria",
    "text": "Histórico cronológico de atividades e alterações relevantes.",
    "detail": "Permite acompanhar testes, diagnósticos, responsáveis e mudanças de estado.",
    "status": "implementado"
  },
  {
    "number": "13",
    "title": "Resumo assistivo por IA",
    "text": "Geração opcional de uma síntese dos fatos registrados no chamado.",
    "detail": "A interface e a rota de API estão implementadas, mas dependem de um provedor externo com credenciais válidas. Há registros de respostas HTTP 503 em 14/10/2026; a geração ao vivo ainda não foi validada. A IA não altera o chamado.",
    "status": "externo-pendente"
  }
];
