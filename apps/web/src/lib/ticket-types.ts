export type TicketCategory = 'NO_CONNECTION' | 'SLOW_CONNECTION' | 'INTERMITTENCE' | 'WIFI' | 'EQUIPMENT' | 'ACCESS_TO_SERVICE' | 'OTHER';
export type TicketStatus = 'OPEN' | 'DIAGNOSING' | 'ESCALATED' | 'RESOLVED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketActivityType = 'NOTE' | 'TEST' | 'DIAGNOSIS';

export type Ticket = {
  id: string;
  protocol: string;
  customerId: string;
  customerName: string;
  customerReferenceCode: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignedToUserId: string | null;
  createdByUserId: string;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type TicketPage = {
  items: Ticket[];
  page: number;
  pageSize: number;
  total: number;
};

export type TimelineItem =
  | { id: string; kind: 'activity'; type: TicketActivityType; actorUserId: string; description: string; createdAt: string }
  | { id: string; kind: 'audit'; action: string; actorUserId: string; metadata: Record<string, unknown>; createdAt: string };

export const categoryLabels: Record<TicketCategory, string> = {
  NO_CONNECTION: 'Sem conexão',
  SLOW_CONNECTION: 'Lentidão',
  INTERMITTENCE: 'Intermitência',
  WIFI: 'Wi-Fi',
  EQUIPMENT: 'Equipamento',
  ACCESS_TO_SERVICE: 'Acesso a serviço',
  OTHER: 'Outro',
};

export const statusLabels: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  DIAGNOSING: 'Em diagnóstico',
  ESCALATED: 'Encaminhado',
  RESOLVED: 'Resolvido',
};

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};
