export const ticketCategories = ['NO_CONNECTION','SLOW_CONNECTION','INTERMITTENCE','WIFI','EQUIPMENT','ACCESS_TO_SERVICE','OTHER'] as const;
export type TicketCategory = typeof ticketCategories[number];

export const ticketStatuses = ['OPEN','DIAGNOSING','ESCALATED','RESOLVED'] as const;
export type TicketStatus = typeof ticketStatuses[number];

export const ticketPriorities = ['LOW','MEDIUM','HIGH','CRITICAL'] as const;
export type TicketPriority = typeof ticketPriorities[number];

export const activityTypes = ['NOTE','TEST','DIAGNOSIS'] as const;
export type TicketActivityType = typeof activityTypes[number];

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

export type TicketPage = { items: Ticket[]; page: number; pageSize: number; total: number };

export type CreateTicketInput = {
  customerId: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
};

export type TicketActivity = {
  id: string;
  ticketId: string;
  authorUserId: string;
  type: TicketActivityType;
  description: string;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  actorUserId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type TimelineItem =
  | { id: string; kind: 'activity'; type: TicketActivityType; actorUserId: string; description: string; createdAt: string }
  | { id: string; kind: 'audit'; action: string; actorUserId: string; metadata: Record<string, unknown>; createdAt: string };
